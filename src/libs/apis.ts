import { CreateBookingDto, Room } from "@/models/room";
import sanityClient from "./sanity";
import * as queries from './sanityQueries';
import axios from "axios";
import hotelRoom from "../../schemaTypes/hotelRoom";
import { log } from "console";
import { Booking } from "@/models/booking";
import { CreateReviewDto, Review, UpdateReviewDto } from "@/models/review";
import { text } from "stream/consumers";

export async function getFeaturedRoom() {
  const result= await sanityClient.fetch<Room>(queries.getFeaturedRoomQuery,{},{cache:'no-cache'});
  return result;
}

export async function getRooms(){
  const result= await sanityClient.fetch<Room[]>(queries.getRoomsQuery,{},{cache:'no-cache'});

  return result;
}

export async function getRoom(slug:string){
  const result= await sanityClient.fetch<Room>(queries.getRoom,{ slug },{ cache:'no-cache' });

  return result;
}

export const createBooking= async ({
  adults,
  children,
  checkinDate,
  checkoutDate,
  hotelRoom,
  numberOfDays,
  user,
  discount,
  totalPrice,
}: CreateBookingDto)=>{
  console.log("coucou");
  const mutation={
    "mutations":[
      {
        "create":{
          "_type":'booking',
          "user":{_type:'reference',_ref:user},
          "hotelRoom":{_type:'reference',_ref:hotelRoom},
          adults,
          children,
          checkinDate,
          checkoutDate,
          numberOfDays,
          discount,
          totalPrice,
        },
      },
    ],
  };

  const {data}= await axios.post(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,mutation,{headers: {Authorization:`Bearer ${process.env.SANITY_STUDIO_TOKEN}`}});

  return data;
};


export const updateHotelRoom = async (hotelRoom: string, duration: number) => {
  // Update the room state to "booked"
  const mutation = {
    "mutations": [
      {
        "patch": {
          "id": hotelRoom,
          "set": {
            isBooked: true,
          },
        },
      },
    ],
  };

  await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    mutation,
    { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
  );

  // Schedule the reset operation
  setTimeout(async () => {
    const resetMutation = {
      "mutations": [
        {
          "patch": {
            "id": hotelRoom,
            "set": {
              isBooked: false,
            },
          },
        },
      ],
    };

    await axios.post(
      `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
      resetMutation,
      { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
    );
  }, duration * 24 * 60 * 60 * 1000); // Convert days to milliseconds
};


export async function getUserBookings(userId:string){
  const result = await sanityClient.fetch<Booking[]>(
    queries.getUserBookingsQuery,
    {userId},
    {cache:'no-cache'}
  );
  return result;
}

export async function getUserData(userId:string){
  const result = await sanityClient.fetch(
    queries.getUserDataQuery,
    {userId},
    {cache:'no-cache'}
  );
  return result;
}

export async function checkReviewExists(userId:string,hotelRoomId:string):Promise<null | {_id:string}> {
  const query=`*[_type=='review' && user._ref==$userId &&hotelRoom._ref==$hotelRoomId][0]{
    _id
  }`;

  const params={
    userId,
    hotelRoomId,
  };

  const result= await sanityClient.fetch(query,params);

  return result ? result : null;
}

export const  updateReview= async ({reviewId,reviewText,userRating} : UpdateReviewDto)=>{
  const mutation = {
    "mutations": [
      {
        "patch": {
          "id": reviewId,
          "set": {
            text:reviewText,
            userRating,
          },
        },
      },
    ],
  };

  const {data}= await axios.post(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,mutation,{headers: {Authorization:`Bearer ${process.env.SANITY_STUDIO_TOKEN}`}});

  return data;
};

export const createReview= async({
  hotelRoomId,
  reviewText,
  userId,
  userRating,
}: CreateReviewDto)=>{
  const mutation= { 
    "mutations": [
      { 
        "create": { 
          "_type": "review",
          "user":{
            _type:"reference",
            _ref:userId,
          },
          "hotelRoom":{
            _type:"reference",
            _ref:hotelRoomId,
          },
          userRating,
          "text":reviewText,  
        }, 
      },
    ],
  };
  
  const {data}= await axios.post(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,mutation,{headers: {Authorization:`Bearer ${process.env.SANITY_STUDIO_TOKEN}`}});

  return data;
};

export async function getRoomReviews(roomId:string){
  const result= await sanityClient.fetch<Review[]>(
    queries.getRoomReviewsQuery,
    {
      roomId,
    },
    {cache:'no-cache'}
  );
  return result;
};