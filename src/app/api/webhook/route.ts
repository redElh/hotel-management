import { createBooking, updateHotelRoom } from "@/libs/apis";
import { log } from "console";

import { NextResponse } from "next/server";
import Stripe from "stripe";

const checkout_session_completed= 'checkout.session.completed';

const stripe= new Stripe(process.env.STRIPE_SECRET_KEY as string,{
  apiVersion: '2024-04-10',
});

export async function POST(req:Request, res:Response){
  const reqBody= await req.text();
  const sig =req.headers.get('stripe-signature');
  const webhookSecret=process.env.STRIPE_WEBHOOK_SECRET;

  let event:Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      // Properly return a response indicating a bad request
      return new NextResponse('Missing signature or webhook secret', { status: 400 });
    }
    event= stripe.webhooks.constructEvent(reqBody,sig,webhookSecret);
  } catch (error:any) {
    return new NextResponse(`Webhook Error: ${error.message}`,{status:500});
  }

  //load our event
  switch(event.type){
    case checkout_session_completed:
      const session=event.data.object as Stripe.Checkout.Session;

      if (!session.metadata) {
        console.error('Session metadata is missing');
        return new NextResponse('Missing metadata in session', { status: 400 });
      }
      
      const {
        adults,
        checkinDate,
        checkoutDate,
        children,
        hotelRoom,
        numberOfDays,
        user,
        discount,
        totalPrice,
      } = session.metadata;

      console.log('Metadata:', session.metadata);
      console.log(hotelRoom);
      

      await createBooking({
        adults:Number(adults),
        children:Number(children),
        numberOfDays:Number(numberOfDays),
        discount:Number(discount),
        totalPrice:Number(totalPrice),
        hotelRoom,
        checkinDate,
        checkoutDate,
        user
      });
      
      //Update hotel Room
      await updateHotelRoom(session.metadata.hotelRoom,Number(session.metadata.numberOfDays));

      //Create a booking
      return NextResponse.json('Booking successful',{
        status:200,
        statusText:'Booking Successful',
      });

    default:
      console.log(`Unhandled event type ${event.type}`);
      
  }
  
  return NextResponse.json('Event Received',{
    status:200,
    statusText:'Event Received',
  });
};