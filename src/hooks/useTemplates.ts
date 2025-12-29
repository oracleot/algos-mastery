// hooks/useTemplates.ts - Hook for accessing pattern templates

import { useCallback } from 'react';
import { TEMPLATES, getTemplatesForTopic, getTemplateById } from '@/data/templates';
import type { Template, TopicSlug } from '@/types';

interface UseTemplatesReturn {
  /** All available templates */
  templates: readonly Template[];
  /** Get templates for a specific topic */
  getTemplatesForTopic: (topic: TopicSlug) => Template[];
  /** Get a specific template by ID */
  getTemplate: (id: string) => Template | undefined;
}

/**
 * Hook for accessing pattern templates
 * Templates are static data so no async loading needed
 */
export function useTemplates(): UseTemplatesReturn {
  const getTemplatesByTopic = useCallback((topic: TopicSlug) => {
    return getTemplatesForTopic(topic);
  }, []);

  const getTemplate = useCallback((id: string) => {
    return getTemplateById(id);
  }, []);

  return {
    templates: TEMPLATES,
    getTemplatesForTopic: getTemplatesByTopic,
    getTemplate,
  };
}
