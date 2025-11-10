import MainLayout from "../components/layout/MainLayout";
import Product from "../components/product/BasicProduct";
import Banner from "../components/layout/Banner";

const Home = () => {
  return (
    <MainLayout>
      <div className="flex py-10 px-40 gap-10 flex-col">
        <div>
          <Banner />
        </div>
        <div>
          <Product />
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
