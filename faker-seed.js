// faker-seed.js
const { faker } = require("@faker-js/faker");
const { Sequelize, Op } = require("sequelize");
const db = require("./models/models"); // assumes your models/index.js exports sequelize + models

const {
  User,
  Categories,
  SubCategories,
  Vendor,
  BankDetails,
  Service,
  SlotSession,
  SlotServiceMap,
  Booking,
  Rating,
  Offers,
  OfferService,
  Banner,
  serviceSubcategory,
  UserDetails,
  Notification,
  Payments,
} = db;

async function seedUsers(count = 10) {
  const usedEmails = new Set();

  const usersData = Array.from({ length: count }, () => {
    let email;
    do {
      email = faker.internet.email();
    } while (usedEmails.has(email));
    usedEmails.add(email);

    return {
      username: faker.internet.username().slice(0, 30),
      userEmail: email,
      type: 1,
      isAllowed: true,
      phoneNumber: faker.phone.number("##########"),
      gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
      age: faker.number.int({ min: 18, max: 80 }),
      profileImg: faker.image.avatar(),
      location: faker.location.city(),
      latitude: parseFloat(faker.location.latitude()),
      longitude: parseFloat(faker.location.longitude()),
      otp: faker.string.alphanumeric(6),
      otpExpiresAt: faker.date.future(),
      created_At: new Date(),
      updated_At: new Date(),
    };
  });

  const users = await User.bulkCreate(usersData, { returning: true });
  return users.map((user) => user.id);
}

async function seedCategories(count = 5) {
  const usedNames = new Set();
  const categoryData = [];

  while (categoryData.length < count) {
    const name = faker.commerce.department().slice(0, 100);
    if (!usedNames.has(name)) {
      usedNames.add(name);
      categoryData.push({
        categoryName: name,
        categoryImage: faker.image.url(),
        searchTags: [faker.word.noun(), faker.word.noun()],
        created_At: new Date(),
        updated_At: new Date(),
      });
    }
  }

  const categories = await Categories.bulkCreate(categoryData, {
    returning: true,
  });
  return categories.map((c) => ({ id: c.id, name: c.categoryName }));
}

async function seedSubCategories(categoryIds, countPerCategories = 2) {
  const subCategoriesData = [];

  for (const { id: categoryId } of categoryIds) {
    for (let i = 0; i < countPerCategories; i++) {
      subCategoriesData.push({
        categoryId,
        subCategoryName: faker.commerce.productAdjective().slice(0, 100),
        categoryImage: faker.image.url(),
        searchTags: [faker.word.noun(), faker.word.noun()],
        created_At: new Date(),
        updated_At: new Date(),
      });
    }
  }

  const subCategories = await SubCategories.bulkCreate(subCategoriesData, {
    returning: true,
  });
  return subCategories.map((s) => s.id);
}

async function seedVendors(userIds, categoryIds, vendorCount = 3) {
  const selectedVendorIds = faker.helpers
    .shuffle(userIds)
    .slice(0, vendorCount);
  const usedEmails = new Set();

  const vendorDetails = selectedVendorIds.map((userId) => {
    let email;
    do {
      email = faker.internet.email();
    } while (usedEmails.has(email));
    usedEmails.add(email);

    return {
      vendorId: userId,
      shopName: faker.company.name().slice(0, 100),
      shopImage: faker.image.url(),
      ownerName: faker.person.fullName().slice(0, 100),
      emailId: email,
      mobileNumber: faker.phone.number("##########"),
      address: faker.location.streetAddress(),
      city: faker.location.city().slice(0, 100),
      state: faker.location.state(),
      pincode: faker.location.zipCode().slice(0, 10),
      categoryId: faker.helpers.arrayElement(categoryIds).id,
      istempClose: false,
      rules: "",
      description: "",
      latitude: parseFloat(faker.location.latitude()),
      longitude: parseFloat(faker.location.longitude()),
      amenities: [faker.word.noun(), faker.word.noun()],
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      initialPayment: faker.number.int({ min: 50, max: 500 }),
      advanceHoursBeforeBook: 1,
      workStartTime: "09:00",
      workEndTime: "18:00",
      docUrl: faker.internet.url(),
      created_At: new Date(),
      updated_At: new Date(),
    };
  });

  const vendors = await Vendor.bulkCreate(vendorDetails, {
    returning: true,
  });
  return vendors.map((v) => ({ vendorId: v.vendorId, id: v.id }));
}

async function seedBankDetails(vendorUsers) {
  const bankData = vendorUsers.map(({ vendorId }) => ({
    vendorId,
    bankName: faker.company.name().slice(0, 100),
    accountType: faker.helpers.arrayElement(["Savings", "Current", "Other"]),
    accountNumber: faker.string.numeric({ length: 12 }),
    accountHolder: faker.person.fullName().slice(0, 100),
    panNumber: faker.string.alphanumeric(10).toUpperCase(),
    tanNumber: faker.string.alphanumeric(10).toUpperCase(),
    gstNumber: faker.string.alphanumeric({ length: 15 }),
    ifscCode: faker.string.alphanumeric({ length: 11 }).toUpperCase(),
    branchName: faker.location.streetAddress().slice(0, 100),
    isVerified: true,
    bankProof: faker.system.fileName("jpg"),
    created_At: new Date(),
    updated_At: new Date(),
  }));

  await BankDetails.bulkCreate(bankData);
}

async function seedServices(vendors, categories, countPerVendor = 2) {
  const serviceData = [];

  for (const vendor of vendors) {
    for (let i = 0; i < countPerVendor; i++) {
      const category = faker.helpers.arrayElement(categories);
      serviceData.push({
        vendorId: vendor.vendorId,
        categoryId: category.id,
        subsubcategoryName: faker.commerce.productAdjective(),
        gstPercentage: faker.number.float({ min: 0, max: 28 }),
        taxModel: faker.helpers.arrayElement(["inclusive", "exclusive"]),
        hintTags: [faker.word.noun(), faker.word.adjective()],
        metaTag: faker.word.noun(),
        metaTagDescription: faker.lorem.sentence(),
        imageUrls: [faker.image.url(), faker.image.url()],
        thumbnail: faker.image.url(),
        serviceTitle: faker.commerce.productName().slice(0, 150),
        servicePrice: faker.number.int({ min: 100, max: 10000 }),
        rating: 0,
        status: "active",
        created_At: new Date(),
        updated_At: new Date(),
      });
    }
  }

  const services = await Service.bulkCreate(serviceData, { returning: true });
  return services.map((service) => ({
    id: service.id,
    vendorId: service.vendorId,
  }));
}

async function seedServiceSubCategories(serviceIds, subCategoriesIds) {
  const data = [];

  for (const service of serviceIds) {
    data.push({
      serviceId: service.id,
      subcategoryId: faker.helpers.arrayElement(subCategoriesIds),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await serviceSubcategory.bulkCreate(data);
}

async function seedSlotSessions(vendorDetailIds, countPerVendor = 2) {
  const sessions = [];

  for (const vendor of vendorDetailIds) {
    for (let i = 0; i < countPerVendor; i++) {
      sessions.push({
        vendorId: vendor.id,
        startTime: "09:00",
        endTime: "10:00",
        price: faker.number.int({ min: 100, max: 500 }),
        capacity: faker.number.int({ min: 1, max: 10 }),
      });
    }
  }

  const slotSessions = await SlotSession.bulkCreate(sessions, {
    returning: true,
  });
  return slotSessions.map((s) => s.id);
}

async function seedSlotServiceMap(slotSessionIds, serviceIds) {
  const maps = [];

  for (const slotId of slotSessionIds) {
    const randomService = faker.helpers.arrayElement(serviceIds);
    maps.push({
      slotSessionId: slotId,
      serviceId: randomService.id,
      status: "active",
    });
  }

  await SlotServiceMap.bulkCreate(maps);
}

async function seedBookings(userIds, services, slotSessionIds, count = 10) {
  const bookings = Array.from({ length: count }, () => {
    const service = faker.helpers.arrayElement(services);
    return {
      userId: faker.helpers.arrayElement(userIds),
      vendorId: service.vendorId,
      serviceId: service.id,
      offerId: null,
      slotSessionId: faker.helpers.arrayElement(slotSessionIds),
      bookingDate: faker.date.future(),
      timeSlot: "09:00 AM - 10:00 AM",
      memberCount: faker.number.int({ min: 1, max: 5 }),
      totalAmount: faker.number.int({ min: 100, max: 10000 }),
      discountAmount: faker.number.int({ min: 0, max: 500 }),
      paymentMode: faker.helpers.arrayElement([
        "cash",
        "online",
        "upi",
        "card",
      ]),
      paymentStatus: faker.helpers.arrayElement(["pending", "paid", "failed"]),
      bookingStatus: faker.helpers.arrayElement([
        "booked",
        "cancelled",
        "completed",
        "rejected",
      ]),
      specialRequest: faker.lorem.words(3),
      ratingGiven: faker.datatype.boolean(),
      created_At: new Date(),
      updated_At: new Date(),
    };
  });

  await Booking.bulkCreate(bookings);
}

async function seedRatings(userIds, services, count = 10) {
  const ratings = Array.from({ length: count }, () => {
    const service = faker.helpers.arrayElement(services);
    return {
      userId: faker.helpers.arrayElement(userIds),
      serviceId: service.id,
      rating: faker.number.float({ min: 0, max: 5 }),
      description: faker.lorem.sentence(),
      created_At: new Date(),
      updated_At: new Date(),
    };
  });

  await Rating.bulkCreate(ratings);
}

async function seedOffers(categoryIds, serviceIds) {
  const offers = Array.from({ length: 3 }, () => ({
    discountType: faker.helpers.arrayElement(["percentage", "flat"]),
    couponTitle: faker.commerce.productAdjective().slice(0, 100),
    couponCode: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
    applicableCategory: faker.helpers.arrayElement(categoryIds).id,
    typeOfDiscount: faker.number.float({ min: 1, max: 5 }),
    limitsforSameUser: faker.number.int({ min: 1, max: 5 }),
    startDate: faker.date.recent(),
    endDate: faker.date.future(),
    created_At: new Date(),
    updated_At: new Date(),
  }));

  const createdOffers = await Offers.bulkCreate(offers, { returning: true });

  const mappings = createdOffers.flatMap((offer) => {
    return faker.helpers
      .arrayElements(
        serviceIds.map((s) => s.id),
        faker.number.int({ min: 1, max: 3 })
      )
      .map((serviceId) => ({
        offerId: offer.id,
        serviceId,
      }));
  });

  await OfferService.bulkCreate(mappings);
}

async function seedBanners(categoryIds, subCategoriesIds) {
  const banners = Array.from({ length: 3 }, () => ({
    bannerType: faker.word.noun().slice(0, 100),
    categoryName: faker.helpers.arrayElement(categoryIds).name,
    subCategoriesName: faker.word.noun().slice(0, 100),
    bannerImage: faker.image.url(),
    redirectURLWeb: faker.internet.url(),
    redirectURLapp: faker.internet.url(),
    platform: ["web", "app"],
    isActive: faker.datatype.boolean(),
    title: faker.lorem.words(3).slice(0, 200),
    description: faker.lorem.sentence(),
    startDate: faker.date.recent(),
    endDate: faker.date.future(),
    created_At: new Date(),
    updated_At: new Date(),
  }));

  await Banner.bulkCreate(banners);
}

async function seedUserDetails(userIds, serviceIds) {
  const details = userIds.map((userId) => ({
    userId,
    address: faker.location.streetAddress(),
    state: faker.location.state(),
    city: faker.location.city(),
    pincode: faker.location.zipCode(),
    isAllowWhatsapp: faker.datatype.boolean(),
    allowNotification: faker.datatype.boolean(),
    searchHistory: Array.from(
      new Set([faker.word.noun(), faker.word.verb(), faker.word.adjective()])
    ),
    lastSeenService: faker.helpers.arrayElements(
      serviceIds.map((s) => s.id),
      faker.number.int({ min: 1, max: 3 })
    ),
    favorites: faker.helpers.arrayElements(
      serviceIds.map((s) => s.id),
      faker.number.int({ min: 1, max: 3 })
    ),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await UserDetails.bulkCreate(details);
}

async function seedNotifications(userIds, countPerUser = 2) {
  const notifications = [];

  for (const userId of userIds) {
    for (let i = 0; i < countPerUser; i++) {
      notifications.push({
        userId,
        title: faker.lorem.words(2),
        body: faker.lorem.sentences(2),
        imageUrl: faker.image.url(),
        type: faker.helpers.arrayElement(["info", "reminder", "alert"]),
        appRoute: "/app/dashboard",
        webRoute: "/web/dashboard",
        isRead: faker.datatype.boolean(),
        created_At: new Date(),
        updated_At: new Date(),
      });
    }
  }

  await Notification.bulkCreate(notifications);
}

async function seedPayments(userIds, count = 25) {
  const bookings = await Booking.findAll({ limit: count }); // get recent bookings

  const payments = bookings.map((booking) => ({
    userId: booking.userId,
    bookingId: booking.id,
    paymentMode: faker.helpers.arrayElement([
      "cash",
      "card",
      "upi",
      "netbanking",
      "wallet",
    ]),
    paymentStatus: faker.helpers
      .arrayElement(["success", "failed", "pending"])
      .toLowerCase()
      .trim(),
    paymentDate: faker.date.recent(),
    amount: booking.totalAmount || faker.number.int({ min: 100, max: 10000 }),
    transactionId: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
    remarks: faker.lorem.sentence(),
    created_At: new Date(),
    updated_At: new Date(),
  }));

  await Payments.bulkCreate(payments);
  console.log(`💳 Payments created: ${payments.length}`);
}

async function runFakerSeed() {
  try {
    console.log("🌱 Starting database seeding...");

    const userIds = await seedUsers(50);
    console.log(`👤 Users created: ${userIds.length}`);

    const categories = await seedCategories(20);
    console.log(`📂 Categories created: ${categories.length}`);

    const subCategoriesIds = await seedSubCategories(categories, 10);
    console.log(`🔽 SubCategories created: ${subCategoriesIds.length}`);

    const vendorUsers = await seedVendors(userIds, categories, 25);
    console.log(`🏪 Vendors created: ${vendorUsers.length}`);

    await seedBankDetails(vendorUsers);
    console.log(`🏦 Bank details added for vendors.`);

    const services = await seedServices(vendorUsers, categories, 15);
    console.log(`🛠️ Services created: ${services.length}`);

    await seedServiceSubCategories(services, subCategoriesIds);
    console.log(`🔗 ServiceSubCategories mapped.`);

    const slotSessionIds = await seedSlotSessions(vendorUsers, 10);
    console.log(`🕐 SlotSessions created: ${slotSessionIds.length}`);

    await seedUserDetails(userIds, services);
    console.log(`🧾 UserDetails created.`);

    await seedNotifications(userIds, 3);
    console.log(`🔔 Notifications created.`);

    await seedSlotServiceMap(slotSessionIds, services);
    console.log(`🔗 SlotServiceMap created.`);

    await seedBookings(userIds, services, slotSessionIds, 25);
    console.log(`🎫 Bookings created.`);

    await seedPayments(userIds, 25);
    console.log(`🎫 Payments done.`);

    await seedRatings(userIds, services, 50);
    console.log(`🌟 Ratings added.`);

    await seedOffers(categories, services);
    console.log(`🏷️ Offers created and linked.`);

    await seedBanners(categories, subCategoriesIds);
    console.log(`📢 Banners created.`);

    console.log("✅ Database seeding completed successfully.");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    process.exit(); // safely exit script
  }
}

runFakerSeed();
