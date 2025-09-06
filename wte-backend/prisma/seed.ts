import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample sites
  const cassavaSite = await prisma.site.upsert({
    where: { name: 'Cassava Processing Site' },
    update: {},
    create: {
      name: 'Cassava Processing Site',
    },
  });

  const livestockSite = await prisma.site.upsert({
    where: { name: 'Livestock Farm Site' },
    update: {},
    create: {
      name: 'Livestock Farm Site',
    },
  });

  // Create admin user
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@wte.com' },
    update: {},
    create: {
      email: 'admin@wte.com',
      password: await hashPassword('admin123'),
    },
  });

  // Create sample waste reports
  const wasteReport1 = await prisma.wasteReport.create({
    data: {
      siteId: cassavaSite.id,
      wasteType: 'Cassava Peels',
      quantity: 50.5,
      unit: 'kg',
      notes: 'Fresh peels from morning processing',
      contactName: 'John Doe',
      contactPhone: '+1234567890',
      status: 'REPORTED',
    },
  });

  const wasteReport2 = await prisma.wasteReport.create({
    data: {
      siteId: livestockSite.id,
      wasteType: 'Animal Waste',
      quantity: 25.0,
      unit: 'kg',
      notes: 'Daily collection from pens',
      contactName: 'Jane Smith',
      contactPhone: '+0987654321',
      status: 'EN_ROUTE',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user:', adminUser.email);
  console.log('🏭 Sites created:', cassavaSite.name, livestockSite.name);
  console.log('🗑️  Waste reports created:', wasteReport1.id, wasteReport2.id);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
