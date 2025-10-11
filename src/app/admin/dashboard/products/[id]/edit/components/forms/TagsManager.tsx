import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FieldErrors } from "react-hook-form";
import { FiTag, FiX } from "react-icons/fi";
import { FormCard } from "../ui/FormCard";
import { ProductFormData } from "../../schemas/productValidation";

interface TagsManagerProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onAddCustomTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  errors: FieldErrors<ProductFormData>;
}

const availableTags = [
  "New Arrival",
  "Trending",
  "Best Seller",
  "Sale",
  "Limited Edition",
];

export function TagsManager({ 
  selectedTags, 
  onToggleTag, 
  onAddCustomTag, 
  onRemoveTag, 
  errors 
}: TagsManagerProps) {
  const [newTag, setNewTag] = useState("");

  const handleAddCustomTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      onAddCustomTag(newTag.trim());
      setNewTag("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  return (
    <FormCard title="Product Tags" icon={<FiTag />}>
      <div className="mb-3">
        <Form.Label>Available Tags</Form.Label>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {availableTags.map((tag) => (
            <Button
              key={tag}
              variant={
                selectedTags.includes(tag)
                  ? "primary"
                  : "outline-secondary"
              }
              size="sm"
              onClick={() => onToggleTag(tag)}
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
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="outline-primary"
            onClick={handleAddCustomTag}
            type="button"
          >
            Add
          </Button>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div>
          <Form.Label>Selected Tags</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="badge bg-primary d-flex align-items-center"
              >
                {tag}
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 ms-1 text-white"
                  onClick={() => onRemoveTag(tag)}
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
    </FormCard>
  );
}