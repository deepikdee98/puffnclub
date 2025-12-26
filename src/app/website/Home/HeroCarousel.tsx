import React, { useState } from "react";
import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  imageMobile: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroCarouselProps {
  banners: Banner[];
  loading: boolean;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners, loading }) => {
  const [index, setIndex] = useState(0);

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "650px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div
        className="hero-slide d-flex align-items-center justify-content-center text-white bg-dark"
        style={{ height: "650px" }}
      >
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4  mb-3">Welcome to PuffnClub</h1>
              <p className="lead mb-4">Discover the latest trends in fashion</p>
              <Button
                as="a"
                href="/website/products"
                variant="light"
                size="lg"
                className="px-4 py-2"
              >
                Shop Now <FiArrowRight className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="position-relative">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        controls={false}
        indicators={false}
      >
        {banners.map((banner) => (
          <Carousel.Item key={banner._id}>
            <div
              className="hero-slide d-flex align-items-center justify-content-center text-white position-relative"
              style={{
                height: "650px",
              }}
            >
              {/* Desktop Background Image */}
              <div
                className="d-none d-md-block position-absolute w-100 h-100"
                style={{
                  backgroundImage: `url(${banner.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  top: 0,
                  left: 0,
                  zIndex: 0,
                }}
              />
              {/* Mobile Background Image */}
              <div
                className="d-block d-md-none position-absolute w-100 h-100"
                style={{
                  backgroundImage: `url(${banner.imageMobile})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  top: 0,
                  left: 0,
                  zIndex: 0,
                }}
              />
              {/* Content Overlay */}
              <Container className="position-relative" style={{ zIndex: 1 }}>
                <Row className="justify-content-start text-start">
                  <Col lg={6} className="py-4">
                    <h3 className=" mb-2 font-bebas text-dark">
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p className="mb-3 text-dark">{banner.subtitle}</p>
                    )}
                    {banner.buttonText && (
                      <Button
                        as="a"
                        href={banner.buttonLink}
                        variant="dark"
                        size="lg"
                      >
                        {banner.buttonText} <FiArrowRight className="ms-2" />
                      </Button>
                    )}
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      {/* Custom Indicator Bars */}
      <div
        className="d-flex justify-content-center position-absolute w-100"
        style={{ bottom: "50px", left: 0, gap: "8px" }}
      >
        {banners.map((_banner, idx) => (
          <span
            key={idx}
            onClick={() => setIndex(idx)}
            style={{
              width: "32px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: idx === index ? "#111" : "#ddd",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
