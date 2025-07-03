module.exports = {
  components: {
    schemas: {
      User: {
        type: "object",
        required: ["username", "type"],
        properties: {
          username: { type: "string", example: "Ashok" },
          userEmail: {
            type: "string",
            format: "email",
            example: "ashok@gmail.com",
          },
          isAllowed: { type: "boolean", example: true },
          phoneNumber: { type: "string", example: "1234567890" },
          gender: { type: "string", example: "male" },
          age: { type: "integer", example: 23 },
          profileImg: {
            type: "string",
            example: "https://example.com/image.jpg",
          },
          history: { type: "string", example: "" },
          location: { type: "string", example: "Thiruvarur" },
          latitude: { type: "number", format: "float", example: 40.7128 },
          longitude: { type: "number", format: "float", example: -74.006 },
        },
      },
      Admin: {
        type: "object",
        required: ["username", "password", "type"],
        properties: {
          username: { type: "string", example: "admin" },
          userEmail: {
            type: "string",
            format: "email",
            example: "admin@gmail.com",
          },
          password: { type: "string", example: "123456" },
          isAllowed: { type: "boolean", example: true },
          phoneNumber: { type: "string", example: "+1987654321" },
          gender: { type: "string", example: "male" },
          age: { type: "integer", example: 35 },
          profileImg: {
            type: "string",
            example: "https://example.com/avatar.jpg",
          },
          history: { type: "string", example: "Updated profile on 2025-03-10" },
          location: { type: "string", example: "Los Angeles" },
          latitude: { type: "number", format: "float", example: 34.0522 },
          longitude: { type: "number", format: "float", example: -118.2437 },
        },
      },
      Banner: {
        type: "object",
        required: ["bannerType"],
        properties: {
          bannerType: { type: "string", example: "Promo" },
          categoryName: { type: "string", example: "Electronics" },
          subCategoryName: { type: "string", example: "Mobile Phones" },
          bannerImage: {
            type: "string",
            example: "assets/banners/banner1.jpg",
          },
          redirectURLWeb: {
            type: "string",
            example: "https://example.com/deal",
          },
          redirectURLapp: { type: "string", example: "app://deal-page" },
          platform: {
            type: "array",
            items: { type: "string" },
            example: ["Web", "Vendor App", "User App"],
          },
          isActive: { type: "boolean", example: true },
          title: { type: "string", example: "Mega Sale" },
          description: {
            type: "string",
            example: "Enjoy up to 70% off on electronics this week only!",
          },
          startDate: {
            type: "string",
            format: "date-time",
            example: "2025-05-01T00:00:00Z",
          },
          endDate: {
            type: "string",
            format: "date-time",
            example: "2025-05-07T23:59:59Z",
          },
          created_At: {
            type: "string",
            format: "date-time",
            example: "2025-04-01T12:00:00Z",
          },
          updated_At: {
            type: "string",
            format: "date-time",
            example: "2025-04-15T15:30:00Z",
          },
        },
      },
      UserDetails: {
        type: "object",
        required: ["userId"],
        properties: {
          id: { type: "integer", example: 1 },
          userId: { type: "integer", example: 101 },
          address: { type: "string", example: "123 MG Road, Indira Nagar" },
          state: { type: "string", example: "Karnataka" },
          city: { type: "string", example: "Bangalore" },
          pincode: { type: "string", example: "560038" },
          isAllowWhatsapp: { type: "boolean", example: true },
          allowNotification: { type: "boolean", example: true },
          searchHistory: {
            type: "array",
            example: ["electronics", "mobile phones"],
            items: { type: "string" },
          },
          lastSeenService: {
            type: "array",
            example: [1, 2, 5],
            items: { type: "integer" },
          },
          favorites: {
            type: "array",
            example: [12, 45, 78],
            items: { type: "integer" },
          },
        },
      },
      Notification: {
        type: "object",
        required: ["userId", "title", "body"],
        properties: {
          userId: {
            type: "integer",
            example: 1,
          },
          title: {
            type: "string",
            example: "Booking Confirmed",
          },
          body: {
            type: "string",
            example: "Your booking for Room #203 has been confirmed.",
          },
          imageUrl: {
            type: "string",
            example: "https://example.com/images/booking.png",
          },
          type: {
            type: "string",
            example: "booking",
          },
          appRoute: {
            type: "string",
            example: "/booking/details/203",
          },
          webRoute: {
            type: "string",
            example: "/web/booking/203",
          },
          isRead: {
            type: "boolean",
            example: false,
          },
        },
      },
      HelpTicket: {
        type: "object",
        required: ["userId", "subject", "message"],
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          userId: {
            type: "integer",
            example: 101,
          },
          subject: {
            type: "string",
            example: "App not working",
          },
          message: {
            type: "string",
            example: "The app crashes whenever I try to login.",
          },
          status: {
            type: "string",
            enum: ["open", "in_progress", "resolved", "closed"],
            default: "open",
            example: "open",
          },
          response: {
            type: "string",
            nullable: true,
            example: "We are working on it.",
          },
          created_At: {
            type: "string",
            format: "date-time",
            example: "2025-06-14T09:00:00.000Z",
          },
          updated_At: {
            type: "string",
            format: "date-time",
            example: "2025-06-15T10:30:00.000Z",
          },
        },
      },
      CommercialLink: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          facebook: {
            type: "string",
            nullable: true,
            example: "https://facebook.com/yourpage",
          },
          twitter: {
            type: "string",
            nullable: true,
            example: "https://twitter.com/yourhandle",
          },
          instagram: {
            type: "string",
            nullable: true,
            example: "https://instagram.com/yourprofile",
          },
          linkedin: {
            type: "string",
            nullable: true,
            example: "https://linkedin.com/in/yourprofile",
          },
          youtube: {
            type: "string",
            nullable: true,
            example: "https://youtube.com/channel/yourchannel",
          },
          website: {
            type: "string",
            nullable: true,
            example: "https://yourwebsite.com",
          },
          whatsapp: {
            type: "string",
            nullable: true,
            example: "+911234567890",
          },
          created_At: {
            type: "string",
            format: "date-time",
            example: "2025-06-14T09:00:00.000Z",
          },
          updated_At: {
            type: "string",
            format: "date-time",
            example: "2025-06-15T10:30:00.000Z",
          },
        },
      },
    },
  },
};
