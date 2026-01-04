const mongoose = require('mongoose');
const Subject = require('./models/Subject.model');

// Connect to MongoDB
mongoose.connect('mongodb://admin:admin123@mongodb:27017/school_library?authSource=admin')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Kenyan Secondary School Subjects
const schoolSubjects = [
  { name: 'Mathematics', code: 'MATH', description: 'Mathematics textbooks and resources for Forms 1-4', color: '#3B82F6', isActive: true },
  { name: 'English', code: 'ENG', description: 'English language and literature books', color: '#EF4444', isActive: true },
  { name: 'Kiswahili', code: 'KIS', description: 'Kiswahili language textbooks', color: '#10B981', isActive: true },
  { name: 'Biology', code: 'BIO', description: 'Biology textbooks and practical guides', color: '#22C55E', isActive: true },
  { name: 'Chemistry', code: 'CHEM', description: 'Chemistry textbooks and laboratory manuals', color: '#8B5CF6', isActive: true },
  { name: 'Physics', code: 'PHY', description: 'Physics textbooks and experiment guides', color: '#06B6D4', isActive: true },
  { name: 'History & Government', code: 'HIST', description: 'History and Government textbooks', color: '#F59E0B', isActive: true },
  { name: 'Geography', code: 'GEO', description: 'Geography textbooks and atlases', color: '#84CC16', isActive: true },
  { name: 'CRE', code: 'CRE', description: 'Christian Religious Education books', color: '#6366F1', isActive: true },
  { name: 'IRE', code: 'IRE', description: 'Islamic Religious Education books', color: '#14B8A6', isActive: true },
  { name: 'Business Studies', code: 'BUS', description: 'Business Studies and Commerce textbooks', color: '#F97316', isActive: true },
  { name: 'Agriculture', code: 'AGR', description: 'Agriculture textbooks and farming guides', color: '#65A30D', isActive: true },
  { name: 'Home Science', code: 'HMS', description: 'Home Science and Nutrition textbooks', color: '#EC4899', isActive: true },
  { name: 'Computer Studies', code: 'COMP', description: 'Computer Studies and ICT textbooks', color: '#0EA5E9', isActive: true },
  { name: 'French', code: 'FRE', description: 'French language textbooks', color: '#DC2626', isActive: true },
  { name: 'German', code: 'GER', description: 'German language textbooks', color: '#000000', isActive: true },
  { name: 'Arabic', code: 'ARA', description: 'Arabic language textbooks', color: '#059669', isActive: true },
  { name: 'Music', code: 'MUS', description: 'Music theory and practical books', color: '#9333EA', isActive: true },
  { name: 'Art & Design', code: 'ART', description: 'Art and Design textbooks', color: '#DB2777', isActive: true },
  { name: 'Physical Education', code: 'PE', description: 'Physical Education and Sports books', color: '#7C3AED', isActive: true },
  { name: 'General Reference', code: 'REF', description: 'Dictionaries, encyclopedias, and reference materials', color: '#64748B', isActive: true }
];

async function seedSubjects() {
  try {
    // Clear existing subjects
    await Subject.deleteMany({});
    console.log('✓ Cleared existing subjects');

    // Insert all subjects
    const result = await Subject.insertMany(schoolSubjects);
    console.log(`✓ Successfully added ${result.length} subjects:\n`);
    result.forEach(subject => {
      console.log(`  • ${subject.name} (${subject.code})`);
    });

    console.log('\n✅ All school subjects have been seeded!');
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedSubjects();
