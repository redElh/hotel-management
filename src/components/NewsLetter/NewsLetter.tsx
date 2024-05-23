"use client";

const NewsLetter = () => {
  return (
    <section className='container mx-auto px-4 md:px-20'>
      <form className='bg-primary text-white px-4 rounded-xl md:rounded-[30px] flex flex-col justify-center items-center py-6 md:py-24'>
        <p className='md:font-semibold text-lg md:text-xl text-center mb-3'>
          Explore More About Our Hotel
        </p>
        <h6 className='md:font-semibold font-medium text-2xl md:text-3xl lg:text-5xl text-center'>
          For more Gallery Pictures
        </h6>

        <div className=' justify-center w-full md:flex-row flex pt-12'>
          <a
            href="https://www.flickr.com/photos/116635093@N05/albums"
            target="_blank"
            rel="noopener noreferrer"
            className='btn-tertiary text-center w-1/3'
          >
            Click here
          </a>
        </div>
      </form>
    </section>
  );
};

export default NewsLetter;