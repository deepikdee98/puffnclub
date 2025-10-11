import React from "react";
import styles from "./style.module.scss";
import { Container } from "react-bootstrap";

const storyCards = [
  {
    heading: "Our Story",
    desc: "Puffn Club was born out of a simple idea — to create clothing that's more than just fabric, but a statement of identity. What started as late-night sketches and endless talks about fashion has grown into a brand dedicated to redefining men's essentials.",
  },
  {
    heading: "Our Vision",
    desc: "We believe a T-shirt is never “just a T-shirt.” It’s confidence, comfort, and individuality woven into every thread. Puffn Club is built for men who want more — more quality, more style, more attitude.",
  },
  {
    heading: "Our Quality",
    desc: "Each piece is crafted with premium fabrics that feel as good as they look. From breathable cotton blends to durable stitching, our focus is on creating clothing that lasts — oversized fits for bold energy, timeless cuts for everyday wear. We obsess over the details so you don’t have to.",
  },
  {
    heading: "Our Club",
    desc: "At Puffn Club, we don’t just sell clothes — we build a community. A space where modern men can embrace their style, push boundaries, and belong to something bigger. Because once you wear Puffn, you’re not just dressed... you’re part of the club.",
  },
];

const BrandStory: React.FC = () => (
  <section className="py-5">
    <Container>
      <h2 className="text-center mb-2">THE STORY BEHIND PUFFN CLUB</h2>
      <p className="text-center text-muted mb-4">
        A vision, to a men’s clothing brand redefining everyday essentials.
      </p>
      <div className={styles.cardsWrapper}>
        {storyCards.map((card) => (
          <div className={styles.storyCard} key={card.heading}>
            <h5 className="fw-semibold mb-2">{card.heading}</h5>
            <p className="mb-0">{card.desc}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default BrandStory;
