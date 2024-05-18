import FeaturedRoom from "@/components/FeaturedRoom/FeaturedRoom";
import Gallery from "@/components/Gallery/Gallery";
import HeroSection from "@/components/HeroSection/HeroSection";
import NewsLetter from "@/components/NewsLetter/NewsLetter";
import PageSearch from "@/components/PageSearch/PageSearch";
import { getFeaturedRoom } from "@/libs/apis";

const Home = async() => {
  const featuredRoom= await getFeaturedRoom();

  console.log(featuredRoom);
  
  return ( 
    <>
      <HeroSection/>
      {/*PAGE SEARCH*/}
      <PageSearch/>
      {/*FEATURED ROOM*/}
      <FeaturedRoom featuredRoom={featuredRoom}/> 
      {/*GALLERY*/}
      <Gallery/>
      {/*NEWS LETTER*/}
      <NewsLetter/>
    </>
  );
}
 
export default Home;