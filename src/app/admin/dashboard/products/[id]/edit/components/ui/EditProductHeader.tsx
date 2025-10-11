import { Button, ProgressBar, Alert } from "react-bootstrap";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { FieldErrors } from "react-hook-form";
import { ProductFormData } from "../../schemas/productValidation";

interface EditProductHeaderProps {
  productId: string;
  isDirty: boolean;
  hasImageChanges: boolean;
  isLoading: boolean;
  isValid: boolean;
  uploadProgress: number;
  errors: FieldErrors<ProductFormData>;
  onSave: () => void;
  onSaveAsDraft: () => void;
}

export function EditProductHeader({
  productId,
  isDirty,
  hasImageChanges,
  isLoading,
  isValid,
  uploadProgress,
  errors,
  onSave,
  onSaveAsDraft,
}: EditProductHeaderProps) {
  return (
    <>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center mb-2">
            <Button
              variant="outline-secondary"
              className="p-0 me-3"
              as="a"
              href={`/admin/dashboard/products/${productId}`}
            >
              <FiArrowLeft size={20} />
            </Button>
            <h1 className="h3 mb-0">
              Edit Product
              {(isDirty || hasImageChanges) && (
                <span className="badge bg-warning text-dark ms-2 fs-6">
                  Unsaved Changes
                </span>
              )}
            </h1>
          </div>
          <p className="text-muted mb-0">
            Update product information and settings
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            as="a"
            href={`/admin/dashboard/products/${productId}`}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            onClick={onSaveAsDraft}
            disabled={isLoading || (!isDirty && !hasImageChanges)}
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            disabled={isLoading || (!isDirty && !hasImageChanges) || !isValid}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Updating...
              </>
            ) : (
              <>
                <FiSave className="me-2" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isLoading && uploadProgress > 0 && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">Uploading...</small>
            <small className="text-muted">{uploadProgress}%</small>
          </div>
          <ProgressBar now={uploadProgress} variant="primary" />
        </div>
      )}

      {/* Display root-level errors */}
      {errors.root && (
        <Alert variant="danger" className="mb-4">
          {errors.root.message}
        </Alert>
      )}
    </>
  );
}