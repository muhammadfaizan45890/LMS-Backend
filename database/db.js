const connectDB = async () => {
  try {
    console.log("MONGO URI:", process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connected");
  } catch (err) {
    console.log("DB ERROR:", err);
    throw err;
  }
};
