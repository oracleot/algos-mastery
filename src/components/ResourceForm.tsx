// components/ResourceForm.tsx - Collapsible form for adding learning resources
// Note: This component uses a div instead of a form to avoid nested form issues
// when embedded inside ProblemForm

import { useState } from 'react';
import { Plus, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { validateResource, isResourceValid } from '@/lib/validation';
import { detectResourceSource } from '@/lib/resourceUtils';
import { generateId } from '@/lib/utils';
import type { LearningResource, ResourceType, ResourceValidationErrors } from '@/types';
import { RESOURCE_TYPES } from '@/types';

interface ResourceFormProps {
  /** Called when a resource is successfully added */
  onAdd: (resource: LearningResource) => void;
}

const typeLabels: Record<ResourceType, string> = {
  video: 'Video',
  article: 'Article',
  documentation: 'Documentation',
};

function ResourceForm({ onAdd }: ResourceFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ResourceType | ''>('');
  const [source, setSource] = useState('');
  const [errors, setErrors] = useState<ResourceValidationErrors>({});

  const handleUrlBlur = () => {
    // Auto-detect source on URL blur
    if (url.trim()) {
      const detectedSource = detectResourceSource(url);
      if (detectedSource) {
        setSource(detectedSource);
      }
    }
  };

  const handleSubmit = () => {
    const resourceData = { title, url, type: type || undefined, source };
    const validationErrors = validateResource(resourceData);
    setErrors(validationErrors);

    if (!isResourceValid(validationErrors)) {
      return;
    }

    const newResource: LearningResource = {
      id: generateId(),
      title: title.trim(),
      url: url.trim(),
      type: type as ResourceType,
      source: source.trim(),
    };

    onAdd(newResource);

    // Reset form and collapse
    setTitle('');
    setUrl('');
    setType('');
    setSource('');
    setErrors({});
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle('');
    setUrl('');
    setType('');
    setSource('');
    setErrors({});
    setIsExpanded(false);
  };

  const updateField = <T,>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    field: keyof ResourceValidationErrors,
    value: T
  ) => {
    setter(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isExpanded) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="gap-1"
      >
        <Plus className="h-4 w-4" />
        Add Resource
      </Button>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Add Learning Resource</h4>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleCancel}
          aria-label="Collapse form"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Title Field */}
        <div className="space-y-2">
          <Label htmlFor="resource-title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="resource-title"
            type="text"
            placeholder="e.g., NeetCode Two Sum Solution"
            value={title}
            onChange={(e) => updateField(setTitle, 'title', e.target.value)}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'resource-title-error' : undefined}
          />
          {errors.title && (
            <p id="resource-title-error" className="text-sm text-destructive">
              {errors.title}
            </p>
          )}
        </div>

        {/* URL Field */}
        <div className="space-y-2">
          <Label htmlFor="resource-url">
            URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="resource-url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => updateField(setUrl, 'url', e.target.value)}
            onBlur={handleUrlBlur}
            aria-invalid={!!errors.url}
            aria-describedby={errors.url ? 'resource-url-error' : undefined}
          />
          {errors.url && (
            <p id="resource-url-error" className="text-sm text-destructive">
              {errors.url}
            </p>
          )}
        </div>

        {/* Type Field */}
        <div className="space-y-2">
          <Label htmlFor="resource-type">
            Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={type}
            onValueChange={(value) => {
              setType(value as ResourceType);
              if (errors.type) {
                setErrors((prev) => ({ ...prev, type: undefined }));
              }
            }}
          >
            <SelectTrigger
              id="resource-type"
              className="w-full"
              aria-invalid={!!errors.type}
              aria-describedby={errors.type ? 'resource-type-error' : undefined}
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {RESOURCE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {typeLabels[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p id="resource-type-error" className="text-sm text-destructive">
              {errors.type}
            </p>
          )}
        </div>

        {/* Source Field (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="resource-source">Source (optional)</Label>
          <Input
            id="resource-source"
            type="text"
            placeholder="Auto-detected or enter manually (e.g., YouTube)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Auto-detected from URL. You can edit if needed.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSubmit}>
            Add Resource
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ResourceForm };
export type { ResourceFormProps };
