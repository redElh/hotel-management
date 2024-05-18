type CoverImage={
  url:string;
};

export type Image={
  _key:string;
  url:string;
};

export type Amenety={
  _key:string;
  amenity:string;
  icon:string;
};

type Slug={
  _type:string;
  current:string;
};

export type Room={
  _id: string;
  coverImage:CoverImage;
  name: string;
  description: string;
  images:Image[];
  dimension:string;
  discount:number;
  isBooked:boolean;
  isFeatured:boolean;
  numberOfBeds:number;
  offeredAmeneties: Amenety[];
  price:number;
  slug:Slug;
  specialNote:string;
  type:string;
};

export type CreateBookingDto={
  user: string;
  hotelRoom:string;
  checkinDate:string;
  checkoutDate:string;
  numberOfDays:number;
  adults:number;
  children:number;
  totalPrice:number;
  discount:number;
};