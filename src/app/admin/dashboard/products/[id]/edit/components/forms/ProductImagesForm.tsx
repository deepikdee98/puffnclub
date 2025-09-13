import { Button, Form } from "react-bootstrap";
import { FiImage, FiUpload, FiX } from "react-icons/fi";
import { FormCard } from "../ui/FormCard";

interface ProductImagesFormProps {
  uploadedImages: string[];
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function ProductImagesForm({ 
  uploadedImages, 
  onImageUpload, 
  onRemoveImage 
}: ProductImagesFormProps) {
  return (
    <FormCard title="Product Images" icon={<FiImage />}>
      <div className="mb-3">
        <Form.Label>Upload Images</Form.Label>
        <div className="border-2 border-dashed border-light rounded p-4 text-center">
          <FiUpload size={32} className="text-muted mb-2" />
          <p className="text-muted mb-2">
            Drag and drop images here, or click to browse
          </p>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={onImageUpload}
            className="d-none"
            id="imageUpload"
          />
          <Button
            variant="outline-primary"
            as="label"
            htmlFor="imageUpload"
            className="cursor-pointer"
          >
            Choose Images
          </Button>
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div className="row g-3">
          {uploadedImages.map((image, index) => (
            <div key={index} className="col-md-3">
              <div className="position-relative">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="img-fluid rounded"
                  style={{ aspectRatio: "1", objectFit: "cover" }}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/200x200?text=Error";
                  }}
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-1"
                  onClick={() => onRemoveImage(index)}
                >
                  <FiX size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </FormCard>
  );
}