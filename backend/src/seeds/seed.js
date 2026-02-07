import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

import { User, Event, Registration } from '../models/index.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventhub';

const users = [
  {
    email: 'admin@eventhub.ma',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'EventHub',
    role: 'admin'
  },
  {
    email: 'user@eventhub.ma',
    password: 'User123!',
    firstName: 'Youssef',
    lastName: 'Alaoui',
    role: 'user'
  },
  {
    email: 'fatima@eventhub.ma',
    password: 'Fatima123!',
    firstName: 'Fatima',
    lastName: 'Bennani',
    role: 'user'
  },
  {
    email: 'omar@eventhub.ma',
    password: 'Omar123!',
    firstName: 'Omar',
    lastName: 'El Idrissi',
    role: 'user'
  }
];

const getEvents = (organizerIds) => {
  const now = new Date();
  const futureDate = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const pastDate = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return [
    {
      title: 'Conférence Tech 2026 - Intelligence Artificielle',
      description: 'Une journée complète dédiée aux dernières avancées en Intelligence Artificielle. Venez découvrir les applications concrètes du machine learning, du deep learning et des grands modèles de langage. Des experts internationaux partageront leurs expériences et visions du futur de l\'IA au Maroc.',
      category: 'conference',
      status: 'published',
      startDate: futureDate(15),
      endDate: futureDate(15.5),
      location: {
        address: 'Technopark, Route de Nouaceur',
        city: 'Casablanca',
        postalCode: '20000',
        country: 'Maroc'
      },
      capacity: 500,
      price: 800,
      organizer: organizerIds[0],
      tags: ['IA', 'Tech', 'Machine Learning', 'Innovation'],
      registrationCount: 0
    },
    {
      title: 'Atelier React & Node.js - Développement Full Stack',
      description: 'Apprenez à créer des applications web modernes avec React et Node.js. Cet atelier pratique vous guidera à travers la création d\'une application complète, de la base de données à l\'interface utilisateur. Niveau intermédiaire requis.',
      category: 'workshop',
      status: 'published',
      startDate: futureDate(7),
      endDate: futureDate(7.3),
      location: {
        address: 'INPT, Madinat Al Irfane',
        city: 'Rabat',
        postalCode: '10100',
        country: 'Maroc'
      },
      capacity: 30,
      price: 400,
      organizer: organizerIds[1],
      tags: ['React', 'Node.js', 'JavaScript', 'Web'],
      registrationCount: 0
    },
    {
      title: 'Festival Gnaoua et Musiques du Monde',
      description: 'Le célèbre festival de musique Gnaoua revient pour une édition exceptionnelle. Au programme : artistes Gnaoua de renommée mondiale, fusions musicales et concerts en plein air face à l\'océan. Une expérience musicale unique au cœur de la médina.',
      category: 'concert',
      status: 'published',
      startDate: futureDate(21),
      endDate: futureDate(23),
      location: {
        address: 'Place Moulay Hassan',
        city: 'Essaouira',
        postalCode: '44000',
        country: 'Maroc'
      },
      capacity: 5000,
      price: 150,
      organizer: organizerIds[2],
      tags: ['Gnaoua', 'Musique', 'Festival', 'Culture'],
      registrationCount: 0
    },
    {
      title: 'Marathon International de Marrakech 2026',
      description: 'Le marathon annuel de Marrakech traverse les plus beaux quartiers de la ville ocre, passant par la Koutoubia, les jardins Majorelle et les remparts historiques. Parcours certifié IAAF, ravitaillements réguliers, médaille finisher pour tous les participants.',
      category: 'sport',
      status: 'published',
      startDate: futureDate(45),
      endDate: futureDate(45.4),
      location: {
        address: 'Place Jemaa el-Fna',
        city: 'Marrakech',
        postalCode: '40000',
        country: 'Maroc'
      },
      capacity: 8000,
      price: 300,
      organizer: organizerIds[0],
      tags: ['Marathon', 'Course', 'Sport', 'Marrakech'],
      registrationCount: 0
    },
    {
      title: 'Networking Startups & Investisseurs - Morocco Tech',
      description: 'Événement de mise en relation entre startups marocaines innovantes et investisseurs. Pitchs de 5 minutes, sessions de networking, et cocktail de clôture. Une opportunité unique de faire grandir votre projet dans l\'écosystème tech marocain.',
      category: 'networking',
      status: 'published',
      startDate: futureDate(10),
      endDate: futureDate(10.2),
      location: {
        address: 'CasaNearshore Park',
        city: 'Casablanca',
        postalCode: '20250',
        country: 'Maroc'
      },
      capacity: 150,
      price: 0,
      organizer: organizerIds[1],
      tags: ['Startup', 'Investissement', 'Networking', 'Business'],
      registrationCount: 0
    },
    {
      title: 'Hackathon Green Tech Morocco',
      description: 'Un hackathon de 48h dédié aux solutions technologiques pour l\'environnement au Maroc. Formez une équipe, développez votre projet et présentez-le devant un jury d\'experts. Des prix à gagner pour les meilleures innovations vertes. Thèmes : énergie solaire, gestion de l\'eau, agriculture durable.',
      category: 'other',
      status: 'published',
      startDate: futureDate(30),
      endDate: futureDate(32),
      location: {
        address: 'UM6P, Université Mohammed VI Polytechnique',
        city: 'Benguerir',
        postalCode: '43150',
        country: 'Maroc'
      },
      capacity: 100,
      price: 100,
      organizer: organizerIds[2],
      tags: ['Hackathon', 'Green Tech', 'Innovation', 'Écologie'],
      registrationCount: 0
    },
    {
      title: 'Formation Cybersécurité - Niveau Avancé',
      description: 'Formation intensive de 2 jours sur les dernières techniques de cybersécurité. Tests d\'intrusion, analyse de malwares, sécurisation des infrastructures cloud. Certification à la clé. Formation dispensée par des experts certifiés CISSP et CEH.',
      category: 'workshop',
      status: 'published',
      startDate: futureDate(20),
      endDate: futureDate(22),
      location: {
        address: 'ENSIAS, Avenue Mohammed Ben Abdellah Regragui',
        city: 'Rabat',
        postalCode: '10000',
        country: 'Maroc'
      },
      capacity: 20,
      price: 2500,
      organizer: organizerIds[0],
      tags: ['Cybersécurité', 'Formation', 'Sécurité informatique'],
      registrationCount: 0
    },
    {
      title: 'Mawazine - Rythmes du Monde',
      description: 'Le plus grand festival de musique d\'Afrique revient avec une programmation exceptionnelle. Artistes internationaux et marocains sur plusieurs scènes à travers la ville. Pop, rock, hip-hop, musique arabe et africaine.',
      category: 'concert',
      status: 'published',
      startDate: futureDate(60),
      endDate: futureDate(67),
      location: {
        address: 'OLM Souissi',
        city: 'Rabat',
        postalCode: '10000',
        country: 'Maroc'
      },
      capacity: 25000,
      price: 500,
      organizer: organizerIds[3],
      tags: ['Musique', 'Festival', 'Mawazine', 'Concert'],
      registrationCount: 0
    },
    {
      title: 'Conférence Management Agile - Agile Morocco',
      description: 'Découvrez les meilleures pratiques du management agile adaptées au contexte marocain. Scrum, Kanban, SAFe... Nos experts partageront leurs retours d\'expérience et conseils pratiques pour transformer votre organisation.',
      category: 'conference',
      status: 'draft',
      startDate: futureDate(25),
      endDate: futureDate(25.4),
      location: {
        address: 'Sofitel Casablanca Tour Blanche',
        city: 'Casablanca',
        postalCode: '20000',
        country: 'Maroc'
      },
      capacity: 200,
      price: 600,
      organizer: organizerIds[1],
      tags: ['Agile', 'Management', 'Scrum', 'Organisation'],
      registrationCount: 0
    },
    {
      title: 'Tournoi International de Golf - Hassan II Trophy',
      description: 'Tournoi de golf prestigieux accueillant des joueurs professionnels et amateurs du monde entier. Compétition sur le célèbre parcours royal, dîner de gala et remise des prix. Ouvert aux inscriptions pour les amateurs confirmés.',
      category: 'sport',
      status: 'published',
      startDate: futureDate(35),
      endDate: futureDate(38),
      location: {
        address: 'Royal Golf Dar Es Salam',
        city: 'Rabat',
        postalCode: '10000',
        country: 'Maroc'
      },
      capacity: 200,
      price: 1500,
      organizer: organizerIds[3],
      tags: ['Golf', 'Sport', 'Tournoi', 'International'],
      registrationCount: 0
    }
  ];
};

async function seed() {
  try {
    console.log('Debut du seeding...');
    console.log(`Connexion a MongoDB: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connecte a MongoDB');

    console.log('Nettoyage de la base de donnees...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});

    console.log('Creation des utilisateurs...');
    const createdUsers = await User.create(users);
    console.log(`   ${createdUsers.length} utilisateurs crees`);

    console.log('Creation des evenements...');
    const organizerIds = createdUsers.map(u => u._id);
    const events = getEvents(organizerIds);
    const createdEvents = await Event.create(events);
    console.log(`   ${createdEvents.length} evenements crees`);

    console.log('Creation des inscriptions...');
    const registrations = [];
    
    const publishedEvents = createdEvents.filter(e => e.status === 'published');
    
    for (let i = 0; i < Math.min(5, publishedEvents.length); i++) {
      const event = publishedEvents[i];
      const eligibleUsers = createdUsers.filter(u => 
        u._id.toString() !== event.organizer.toString()
      );
      
      for (let j = 0; j < Math.min(2, eligibleUsers.length); j++) {
        registrations.push({
          user: eligibleUsers[j]._id,
          event: event._id,
          status: 'confirmed'
        });
      }
    }

    if (registrations.length > 0) {
      await Registration.create(registrations);
      
      for (const reg of registrations) {
        await Event.findByIdAndUpdate(reg.event, {
          $inc: { registrationCount: 1 }
        });
      }
      console.log(`   ${registrations.length} inscriptions creees`);
    }

    console.log('\n============================================');
    console.log('Seeding termine avec succes !');
    console.log('============================================');
    console.log('\nComptes de test :');
    console.log('--------------------------------------------');
    console.log('   Admin : admin@eventhub.ma / Admin123!');
    console.log('   User  : user@eventhub.ma / User123!');
    console.log('   User  : fatima@eventhub.ma / Fatima123!');
    console.log('   User  : omar@eventhub.ma / Omar123!');
    console.log('--------------------------------------------\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
