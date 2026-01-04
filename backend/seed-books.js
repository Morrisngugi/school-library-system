const mongoose = require('mongoose');
const Book = require('./models/Book.model');
const Subject = require('./models/Subject.model');

// Connect to MongoDB
mongoose.connect('mongodb://admin:admin123@mongodb:27017/school_library?authSource=admin')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function seedBooks() {
  try {
    // Fetch all subjects to get their IDs
    const subjects = await Subject.find();
    const subjectMap = {};
    subjects.forEach(subject => {
      subjectMap[subject.name] = subject._id;
    });

    // Clear existing books
    await Book.deleteMany({});
    console.log('✓ Cleared existing books');

    // Sample textbooks for Kenyan secondary schools
    const sampleBooks = [
      // Mathematics Books
      {
        title: 'KLB Mathematics Form 1',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-001-1',
        barcode: 'MATH-F1-001',
        subject: subjectMap['Mathematics'],
        form: 'Form 1',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 50,
        availableCopies: 50,
        status: 'available',
        description: 'Mathematics textbook for Form 1 students covering Numbers, Algebra, Geometry, and Statistics',
        location: { shelf: 'A1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC001'
      },
      {
        title: 'KLB Mathematics Form 2',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-002-8',
        barcode: 'MATH-F2-001',
        subject: subjectMap['Mathematics'],
        form: 'Form 2',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 45,
        availableCopies: 45,
        status: 'available',
        description: 'Mathematics textbook for Form 2 students covering advanced Algebra, Geometry, and Trigonometry',
        location: { shelf: 'A1', rack: 'R2', floor: 1 },
        accessionNumber: 'ACC002'
      },
      {
        title: 'KLB Mathematics Form 3',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-003-5',
        barcode: 'MATH-F3-001',
        subject: subjectMap['Mathematics'],
        form: 'Form 3',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 40,
        availableCopies: 40,
        status: 'available',
        description: 'Mathematics textbook for Form 3 students covering Vectors, Matrices, and Calculus',
        location: { shelf: 'A1', rack: 'R3', floor: 1 },
        accessionNumber: 'ACC003'
      },
      {
        title: 'KLB Mathematics Form 4',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-004-2',
        barcode: 'MATH-F4-001',
        subject: subjectMap['Mathematics'],
        form: 'Form 4',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 40,
        availableCopies: 40,
        status: 'available',
        description: 'Mathematics textbook for Form 4 KCSE preparation',
        location: { shelf: 'A1', rack: 'R4', floor: 1 },
        accessionNumber: 'ACC004'
      },
      
      // English Books
      {
        title: 'English Grammar in Use - Form 1',
        authors: ['Raymond Murphy'],
        isbn: '978-0521189392',
        barcode: 'ENG-F1-001',
        subject: subjectMap['English'],
        form: 'Form 1',
        publisher: 'Cambridge University Press',
        publicationYear: 2022,
        language: 'English',
        totalCopies: 55,
        availableCopies: 55,
        status: 'available',
        description: 'Comprehensive English grammar textbook for Form 1',
        location: { shelf: 'B1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC005'
      },
      {
        title: 'The River and The Source',
        authors: ['Margaret Ogola'],
        isbn: '978-9966-46-523-0',
        barcode: 'ENG-SET-001',
        subject: subjectMap['English'],
        form: 'General',
        publisher: 'Focus Publishers',
        publicationYear: 2020,
        language: 'English',
        totalCopies: 60,
        availableCopies: 60,
        status: 'available',
        description: 'KCSE Set Book - A story of four generations of women',
        location: { shelf: 'B2', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC006',
        isPopular: true
      },
      {
        title: 'Blossoms of the Savannah',
        authors: ['Henry Ole Kulet'],
        isbn: '978-9966-25-486-8',
        barcode: 'ENG-SET-002',
        subject: subjectMap['English'],
        form: 'General',
        publisher: 'Longhorn Publishers',
        publicationYear: 2021,
        language: 'English',
        totalCopies: 55,
        availableCopies: 55,
        status: 'available',
        description: 'KCSE Set Book - Story about two sisters facing FGM',
        location: { shelf: 'B2', rack: 'R2', floor: 1 },
        accessionNumber: 'ACC007',
        isPopular: true
      },

      // Kiswahili Books
      {
        title: 'Sarufi Maumbo ya Kiswahili',
        authors: ['KICD'],
        isbn: '978-9966-00-101-5',
        barcode: 'KIS-F1-001',
        subject: subjectMap['Kiswahili'],
        form: 'Form 1',
        publisher: 'Jomo Kenyatta Foundation',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 50,
        availableCopies: 50,
        status: 'available',
        description: 'Kiswahili grammar textbook for Form 1',
        location: { shelf: 'C1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC008'
      },
      {
        title: 'Ushairi wa Kiswahili',
        authors: ['KICD'],
        isbn: '978-9966-00-201-2',
        barcode: 'KIS-F2-001',
        subject: subjectMap['Kiswahili'],
        form: 'Form 2',
        publisher: 'Jomo Kenyatta Foundation',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 45,
        availableCopies: 45,
        status: 'available',
        description: 'Kiswahili poetry and literature for Form 2',
        location: { shelf: 'C1', rack: 'R2', floor: 1 },
        accessionNumber: 'ACC009'
      },

      // Biology Books
      {
        title: 'KLB Biology Form 1',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-101-8',
        barcode: 'BIO-F1-001',
        subject: subjectMap['Biology'],
        form: 'Form 1',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 50,
        availableCopies: 50,
        status: 'available',
        description: 'Introduction to Biology covering cells, classification, and nutrition',
        location: { shelf: 'D1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC010'
      },
      {
        title: 'KLB Biology Form 2',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-102-5',
        barcode: 'BIO-F2-001',
        subject: subjectMap['Biology'],
        form: 'Form 2',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 48,
        availableCopies: 48,
        status: 'available',
        description: 'Biology textbook covering transport, respiration, and excretion',
        location: { shelf: 'D1', rack: 'R2', floor: 1 },
        accessionNumber: 'ACC011'
      },
      {
        title: 'KLB Biology Form 3',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-103-2',
        barcode: 'BIO-F3-001',
        subject: subjectMap['Biology'],
        form: 'Form 3',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 45,
        availableCopies: 45,
        status: 'available',
        description: 'Biology textbook covering reproduction, growth, and evolution',
        location: { shelf: 'D1', rack: 'R3', floor: 1 },
        accessionNumber: 'ACC012'
      },

      // Chemistry Books
      {
        title: 'KLB Chemistry Form 1',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-201-5',
        barcode: 'CHEM-F1-001',
        subject: subjectMap['Chemistry'],
        form: 'Form 1',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 48,
        availableCopies: 48,
        status: 'available',
        description: 'Introduction to Chemistry covering matter, atomic structure, and chemical reactions',
        location: { shelf: 'E1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC013'
      },
      {
        title: 'KLB Chemistry Form 2',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-202-2',
        barcode: 'CHEM-F2-001',
        subject: subjectMap['Chemistry'],
        form: 'Form 2',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 45,
        availableCopies: 45,
        status: 'available',
        description: 'Chemistry textbook covering chemical equations, mole concept, and acids',
        location: { shelf: 'E1', rack: 'R2', floor: 1 },
        accessionNumber: 'ACC014'
      },

      // Physics Books
      {
        title: 'KLB Physics Form 1',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-301-2',
        barcode: 'PHY-F1-001',
        subject: subjectMap['Physics'],
        form: 'Form 1',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 50,
        availableCopies: 50,
        status: 'available',
        description: 'Introduction to Physics covering measurements, forces, and motion',
        location: { shelf: 'F1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC015'
      },
      {
        title: 'KLB Physics Form 2',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-302-9',
        barcode: 'PHY-F2-001',
        subject: subjectMap['Physics'],
        form: 'Form 2',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 48,
        availableCopies: 48,
        status: 'available',
        description: 'Physics textbook covering pressure, light, and waves',
        location: { shelf: 'F1', rack: 'R2', floor: 1 },
        accessionNumber: 'ACC016'
      },

      // History & Government
      {
        title: 'KLB History and Government Form 1',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-401-9',
        barcode: 'HIST-F1-001',
        subject: subjectMap['History & Government'],
        form: 'Form 1',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 45,
        availableCopies: 45,
        status: 'available',
        description: 'History and Government covering early man and civilizations',
        location: { shelf: 'G1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC017'
      },

      // Geography
      {
        title: 'KLB Geography Form 1',
        authors: ['Kenya Literature Bureau'],
        isbn: '978-9966-48-501-6',
        barcode: 'GEO-F1-001',
        subject: subjectMap['Geography'],
        form: 'Form 1',
        publisher: 'Kenya Literature Bureau',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 48,
        availableCopies: 48,
        status: 'available',
        description: 'Geography textbook covering the Earth, maps, and weather',
        location: { shelf: 'H1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC018'
      },

      // Computer Studies
      {
        title: 'Computer Studies Form 1',
        authors: ['Peter Kariuki'],
        isbn: '978-9966-25-101-0',
        barcode: 'COMP-F1-001',
        subject: subjectMap['Computer Studies'],
        form: 'Form 1',
        publisher: 'Longhorn Publishers',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 40,
        availableCopies: 40,
        status: 'available',
        description: 'Introduction to computers and ICT fundamentals',
        location: { shelf: 'I1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC019'
      },

      // Business Studies
      {
        title: 'Commerce Form 1',
        authors: ['Peter Muriithi'],
        isbn: '978-9966-25-201-7',
        barcode: 'BUS-F1-001',
        subject: subjectMap['Business Studies'],
        form: 'Form 1',
        publisher: 'Longhorn Publishers',
        publicationYear: 2023,
        language: 'English',
        totalCopies: 35,
        availableCopies: 35,
        status: 'available',
        description: 'Introduction to business and commerce',
        location: { shelf: 'J1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC020'
      },

      // Reference Books
      {
        title: 'Oxford Advanced Learners Dictionary',
        authors: ['Oxford University Press'],
        isbn: '978-0194799041',
        barcode: 'REF-001',
        subject: subjectMap['General Reference'],
        form: 'General',
        publisher: 'Oxford University Press',
        publicationYear: 2020,
        language: 'English',
        totalCopies: 20,
        availableCopies: 20,
        status: 'available',
        description: 'Comprehensive English dictionary for advanced learners',
        location: { shelf: 'Z1', rack: 'R1', floor: 1 },
        accessionNumber: 'ACC021',
        isReference: true
      },
      {
        title: 'Kamusi ya Kiswahili Sanifu',
        authors: ['TUKI'],
        isbn: '978-9976-973-06-9',
        barcode: 'REF-002',
        subject: subjectMap['General Reference'],
        form: 'General',
        publisher: 'Oxford University Press',
        publicationYear: 2019,
        language: 'English',
        totalCopies: 15,
        availableCopies: 15,
        status: 'available',
        description: 'Standard Kiswahili dictionary',
        location: { shelf: 'Z1', rack: 'R2', floor: 1 },
        accessionNumber: 'ACC022',
        isReference: true
      }
    ];

    // Insert all books
    const result = await Book.insertMany(sampleBooks);
    console.log(`✓ Successfully added ${result.length} sample textbooks:\n`);
    
    // Group by subject and form
    const booksBySubject = {};
    result.forEach(book => {
      const subjectName = subjects.find(s => s._id.equals(book.subject))?.name || 'Unknown';
      if (!booksBySubject[subjectName]) {
        booksBySubject[subjectName] = [];
      }
      booksBySubject[subjectName].push(`  • ${book.title} (${book.form}) - ${book.totalCopies} copies`);
    });

    // Display by subject
    Object.keys(booksBySubject).sort().forEach(subject => {
      console.log(`\n${subject}:`);
      booksBySubject[subject].forEach(book => console.log(book));
    });

    // Update book counts for subjects
    for (const subject of subjects) {
      const count = await Book.countDocuments({ subject: subject._id });
      await Subject.findByIdAndUpdate(subject._id, { bookCount: count });
    }

    console.log('\n✅ All sample textbooks have been added and subject counts updated!');
  } catch (error) {
    console.error('❌ Error seeding books:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedBooks();

