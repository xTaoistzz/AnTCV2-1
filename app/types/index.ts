// src/types/index.ts

export interface Annotation {
    id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    class_label: string;
  }
  
  export interface CanvasAnnotationProps {
    idproject: string;
    iddetection: string;
    imageUrl: string;
  }
  
  export interface AnnotationCanvasProps {
    imageUrl: string;
    annotations: Annotation[];
    vocabulary: string[];
    onAddAnnotation: (annotation: Annotation) => void;
    onUpdateAnnotation: (index: number, annotation: Annotation) => void;
    onDeleteAnnotation: (id: number) => void;
  }