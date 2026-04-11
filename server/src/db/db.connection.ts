import mongoose from "mongoose";

export const dbConnection = async (db_uri: string, db_name: string) => {
  try {
    const res = await mongoose.connect(`${db_uri}/${db_name}`);
    console.log("DB Connection successfull");
    return res;
  } catch (error) {
    throw new Error("DB Connection failed");
  }
};
