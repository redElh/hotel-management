import { checkReviewExists, createReview, getUserBookings, getUserData, updateReview } from "@/libs/apis";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { generateBookingFile } from "@/libs/fileGenerator"; // A utility to generate the booking file
import fs from "fs";
import path from "path";

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Authentication Required", { status: 500 });
  }

  const userId = session.user.id;
  const url = new URL(req.url);
  const downloadFile = url.searchParams.get('downloadFile');

  if (downloadFile) {
    try {
      const bookings = await getUserBookings(userId);
      if (!bookings || bookings.length === 0) {
        return new NextResponse("No bookings found", { status: 404 });
      }

      const latestBooking = bookings[bookings.length - 1];

      const userData = await getUserData(userId);
      const filePath = await generateBookingFile(latestBooking, userData);

      const fileContent = fs.readFileSync(filePath);
      const fileName = `booking-confirmation-${latestBooking._id}.txt`;

      const response = new NextResponse(fileContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error cleaning up the file:", err);
        }
      });

      return response;
    } catch (error) {
      console.error("Error generating booking file:", error);
      return new NextResponse("Error generating booking file", { status: 500 });
    }
  }

  try {
    const data = await getUserData(userId);
    return NextResponse.json(data, { status: 200, statusText: 'Successful' });
  } catch (error) {
    return new NextResponse('Unable to fetch', { status: 400 });
  }
}

export async function POST(req:Request,res:Response) {
  const session= await getServerSession(authOptions);

  if(!session){
    return new NextResponse("Authentication Required",{status:500});
  }

  const {roomId,reviewText,ratingValue}= await req.json();

  if(!roomId || !reviewText || !ratingValue){
    return new NextResponse("All fields are required",{status:400});
  }

  const userId=session.user.id;

  try {
    //Check if already exists
    const alreadyExists= await checkReviewExists(userId,roomId);

    let data;

    if(alreadyExists){
      data= await updateReview({
        reviewId:alreadyExists._id,
        reviewText,
        userRating:ratingValue,
      });
    }else{
      data= await createReview({
        hotelRoomId:roomId,
        reviewText,
        userId,
        userRating:ratingValue,
      });
    }

    return NextResponse.json(data,{status:200,statusText:"Successful"});
    
  } catch (error:any) {
    console.log('Error Updating',error);
    return new NextResponse('Unable to create review',{status:400});
  }
  
}