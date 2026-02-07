import { Event, User, Registration, File } from '../models/index.js';

class StatsService {
  async getDashboardStats(userId = null, isAdmin = false) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const eventFilter = isAdmin ? {} : { organizer: userId };
    const publishedFilter = { ...eventFilter, status: 'published' };

    const userEventIds = await Event.find(eventFilter).select('_id');
    const eventIds = userEventIds.map(e => e._id);

    const [
      totalEvents,
      publishedEvents,
      totalRegistrations,
      totalUsers,
      eventsThisMonth,
      eventsLastMonth,
      registrationsThisMonth,
      revenueData,
      capacityData
    ] = await Promise.all([
      Event.countDocuments(eventFilter),
      Event.countDocuments(publishedFilter),
      isAdmin 
        ? Registration.countDocuments({ status: 'confirmed' })
        : Registration.countDocuments({
            event: { $in: eventIds },
            status: 'confirmed'
          }),
      isAdmin ? User.countDocuments() : null,
      Event.countDocuments({ ...eventFilter, createdAt: { $gte: startOfMonth } }),
      Event.countDocuments({ 
        ...eventFilter, 
        createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } 
      }),
      Registration.countDocuments({ 
        status: 'confirmed', 
        registeredAt: { $gte: startOfMonth } 
      }),
      Registration.aggregate([
        { $match: { event: { $in: eventIds }, status: 'confirmed' } },
        { $lookup: { from: 'events', localField: 'event', foreignField: '_id', as: 'eventData' } },
        { $unwind: '$eventData' },
        { $group: { _id: null, total: { $sum: '$eventData.price' } } }
      ]),
      Event.aggregate([
        { $match: eventFilter },
        { $group: { _id: null, totalCapacity: { $sum: '$capacity' }, totalRegistrations: { $sum: '$registrationCount' } } }
      ])
    ]);

    const upcomingEvents = await Event.countDocuments({
      ...publishedFilter,
      startDate: { $gt: now }
    });

    const eventsByCategory = await Event.aggregate([
      { $match: eventFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const eventsByStatus = await Event.aggregate([
      { $match: eventFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const eventsGrowth = eventsLastMonth > 0 
      ? Math.round(((eventsThisMonth - eventsLastMonth) / eventsLastMonth) * 100)
      : eventsThisMonth > 0 ? 100 : 0;

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    const fillRate = capacityData.length > 0 && capacityData[0].totalCapacity > 0
      ? Math.round((capacityData[0].totalRegistrations / capacityData[0].totalCapacity) * 100)
      : 0;

    const stats = {
      myEvents: totalEvents,
      totalEvents,
      publishedEvents,
      upcomingEvents,
      totalRegistrations,
      eventsThisMonth,
      registrationsThisMonth,
      eventsGrowth,
      totalRevenue,
      fillRate,
      eventsByCategory,
      eventsByStatus
    };

    if (isAdmin) {
      stats.totalUsers = totalUsers;
    }

    return stats;
  }

  async getEventsByCategory(userId = null, isAdmin = false) {
    const matchStage = isAdmin ? {} : { organizer: userId };

    const stats = await Event.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' },
          totalRegistrations: { $sum: '$registrationCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const categoryLabels = {
      conference: 'Conférences',
      workshop: 'Ateliers',
      concert: 'Concerts',
      sport: 'Sport',
      networking: 'Networking',
      other: 'Autres'
    };

    return stats.map(s => ({
      category: s._id,
      label: categoryLabels[s._id] || s._id,
      count: s.count,
      totalCapacity: s.totalCapacity,
      totalRegistrations: s.totalRegistrations,
      fillRate: s.totalCapacity > 0 
        ? Math.round((s.totalRegistrations / s.totalCapacity) * 100) 
        : 0
    }));
  }

  async getEventsByStatus(userId = null, isAdmin = false) {
    const matchStage = isAdmin ? {} : { organizer: userId };

    const stats = await Event.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusLabels = {
      draft: 'Brouillons',
      published: 'Publiés',
      cancelled: 'Annulés',
      completed: 'Terminés'
    };

    return stats.map(s => ({
      status: s._id,
      label: statusLabels[s._id] || s._id,
      count: s.count
    }));
  }

  async getRegistrationsTrend(userId = null, isAdmin = false) {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    let eventIds = [];
    if (!isAdmin && userId) {
      const userEvents = await Event.find({ organizer: userId }).select('_id');
      eventIds = userEvents.map(e => e._id);
    }

    const matchStage = isAdmin 
      ? { registeredAt: { $gte: twelveMonthsAgo } }
      : { 
          event: { $in: eventIds },
          registeredAt: { $gte: twelveMonthsAgo }
        };

    const stats = await Registration.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$registeredAt' },
            month: { $month: '$registeredAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const result = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const found = stats.find(s => s._id.year === year && s._id.month === month);
      
      result.push({
        year,
        month,
        label: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        count: found ? found.count : 0
      });
    }

    return result;
  }

  async getEventsTrend(userId = null, isAdmin = false) {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const matchStage = isAdmin 
      ? { createdAt: { $gte: twelveMonthsAgo } }
      : { organizer: userId, createdAt: { $gte: twelveMonthsAgo } };

    const stats = await Event.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const result = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const found = stats.find(s => s._id.year === year && s._id.month === month);
      
      result.push({
        year,
        month,
        label: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        count: found ? found.count : 0
      });
    }

    return result;
  }

  async getTopEvents(userId = null, isAdmin = false, limit = 5) {
    const matchStage = isAdmin 
      ? { status: 'published' }
      : { organizer: userId, status: 'published' };

    const events = await Event.find(matchStage)
      .sort('-registrationCount')
      .limit(limit)
      .select('title category registrationCount capacity startDate')
      .lean();

    return events.map(e => ({
      ...e,
      fillRate: e.capacity > 0 
        ? Math.round((e.registrationCount / e.capacity) * 100) 
        : 0
    }));
  }

  async getUpcomingEvents(userId = null, isAdmin = false, limit = 5) {
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const matchStage = isAdmin 
      ? { status: 'published', startDate: { $gte: now, $lte: thirtyDaysLater } }
      : { organizer: userId, status: 'published', startDate: { $gte: now, $lte: thirtyDaysLater } };

    const events = await Event.find(matchStage)
      .sort('startDate')
      .limit(limit)
      .select('title category startDate location registrationCount capacity')
      .lean();

    return events.map(e => ({
      ...e,
      availableSpots: e.capacity - e.registrationCount,
      daysUntil: Math.ceil((new Date(e.startDate) - now) / (1000 * 60 * 60 * 24))
    }));
  }

  async getAdminStats() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      totalFiles,
      totalStorageUsed
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: startOfWeek } }),
      File.countDocuments(),
      File.aggregate([
        { $group: { _id: null, total: { $sum: '$size' } } }
      ])
    ]);

    return {
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      totalFiles,
      totalStorageUsed: totalStorageUsed[0]?.total || 0,
      storageUsedMB: Math.round((totalStorageUsed[0]?.total || 0) / (1024 * 1024) * 100) / 100
    };
  }
}

export default new StatsService();
