// components/TemplateSelector.tsx - Dropdown for selecting pattern templates

import { useState } from 'react';
import { FileCode, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTemplates } from '@/hooks/useTemplates';
import { getTopicName } from '@/data/topics';
import type { Template, TopicSlug } from '@/types';

interface TemplateSelectorProps {
  /** Current topic to prioritize relevant templates */
  currentTopic?: TopicSlug;
  /** Called when a template is selected */
  onSelect: (template: Template) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
}

/**
 * Template selector with categorized list of algorithm patterns
 */
export function TemplateSelector({
  currentTopic,
  onSelect,
  disabled = false,
}: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { templates, getTemplatesForTopic } = useTemplates();

  // Get templates for current topic first, then others
  const currentTopicTemplates = currentTopic ? getTemplatesForTopic(currentTopic) : [];
  const otherTemplates = templates.filter(
    (t) => !currentTopic || t.topic !== currentTopic
  );

  // Group other templates by topic
  const templatesByTopic = otherTemplates.reduce(
    (acc, template) => {
      if (!acc[template.topic]) {
        acc[template.topic] = [];
      }
      acc[template.topic].push(template);
      return acc;
    },
    {} as Record<TopicSlug, Template[]>
  );

  const handleSelect = (template: Template) => {
    onSelect(template);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="gap-1"
      >
        <FileCode className="h-4 w-4" />
        Insert Template
        <ChevronDown className="h-3 w-3" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Insert Pattern Template</DialogTitle>
            <DialogDescription>
              Select a template to insert at your cursor position
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2 -mr-2">
            {/* Current topic templates first */}
            {currentTopic && currentTopicTemplates.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-primary mb-3 sticky top-0 bg-background py-1">
                  {getTopicName(currentTopic)} (Current Topic)
                </h3>
                <div className="space-y-2">
                  {currentTopicTemplates.map((template) => (
                    <TemplateItem
                      key={template.id}
                      template={template}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other templates grouped by topic */}
            {Object.entries(templatesByTopic).map(([topic, topicTemplates]) => (
              <div key={topic} className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 sticky top-0 bg-background py-1">
                  {getTopicName(topic as TopicSlug)}
                </h3>
                <div className="space-y-2">
                  {topicTemplates.map((template) => (
                    <TemplateItem
                      key={template.id}
                      template={template}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface TemplateItemProps {
  template: Template;
  onSelect: (template: Template) => void;
}

function TemplateItem({ template, onSelect }: TemplateItemProps) {
  return (
    <button
      onClick={() => onSelect(template)}
      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
    >
      <div className="font-medium text-sm">{template.name}</div>
      <div className="text-xs text-muted-foreground mt-1">
        {template.description}
      </div>
    </button>
  );
}

export type { TemplateSelectorProps };
