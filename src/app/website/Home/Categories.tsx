import React from "react";
import styles from "./style.module.scss";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

type CategoryItem = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

interface CategoriesProps {
  categories: CategoryItem[];
  loading: boolean;
}

const Categories: React.FC<CategoriesProps> = ({ categories, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <p>Loading categories...</p>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-5">
        <p>No categories available.</p>
      </div>
    );
  }

  return (
    <section className={`${styles.relatableSection} py-5`}>
      <Container className="text-center">
        <h2 className=" mb-2">REDEFINING MEN’S STYLE</h2>
        <p className="mb-4 text-muted">
          Drop-ready fits built to move with your hustle.
        </p>
        <Row className="g-4 justify-content-center">
          {categories.map(({ _id, name, slug, image }) => (
            <Col
              xs={12}
              md={4}
              key={_id}
              className={`${styles.cardWrapper} d-flex flex-column align-items-center`}
            >
              <Link 
                href={`/website/products?category=${slug}`}
                className="text-decoration-none w-100"
              >
                <div
                  className={`${styles.cardImg} w-100 mb-2 overflow-hidden position-relative`}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={image || "/images/default-category.png"}
                    alt={name}
                    width={400}
                    height={400}
                    className="img-fluid rounded-2"
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                  <span
                    className={`${styles.cardLabel} position-absolute start-50 top-50 translate-middle fw-semibold text-white`}
                  >
                    {name}
                  </span>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Categories;
