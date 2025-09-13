"use client";

import { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { FiTag, FiX } from "react-icons/fi";
import { ProductFormData } from "../schemas/productValidation";
import { availableTags } from "../constants/productConstants";

interface TagsSectionProps {
  errors: FieldErrors<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
}

export default function TagsSection({
  errors,
  watch,
  setValue,
}: TagsSectionProps) {
  const [newTag, setNewTag] = useState("");
  const watchedTags = watch("tags", []);

  const addCustomTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      setValue("tags", [...watchedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Header className="bg-light border-0">
        <h5 className="mb-0">
          <FiTag className="me-2" />
          Product Tags
        </h5>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <Form.Label>Available Tags</Form.Label>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {availableTags.map((tag) => (
              <Button
                key={tag}
                variant={
                  watchedTags.includes(tag)
                    ? "primary"
                    : "outline-secondary"
                }
                size="sm"
                onClick={() => {
                  if (watchedTags.includes(tag)) {
                    removeTag(tag);
                  } else {
                    setValue("tags", [...watchedTags, tag]);
                  }
                }}
                type="button"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <Form.Label>Add Custom Tag</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Enter custom tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(), addCustomTag())
              }
            />
            <Button
              variant="outline-primary"
              onClick={addCustomTag}
              type="button"
            >
              Add
            </Button>
          </div>
        </div>

        {watchedTags.length > 0 && (
          <div>
            <Form.Label>Selected Tags</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {watchedTags.map((tag) => (
                <span
                  key={tag}
                  className="badge bg-primary d-flex align-items-center"
                >
                  {tag}
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 ms-1 text-white"
                    onClick={() => removeTag(tag)}
                    type="button"
                  >
                    <FiX size={12} />
                  </Button>
                </span>
              ))}
            </div>
          </div>
        )}

        {errors.tags && (
          <div className="text-danger mt-2 small">
            {errors.tags.message}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}