export interface Project {
    idproject: number;
    project_name: string;
    description: string;
    type: string;
    isShared: boolean;
    progress?: {
      total: number;
      process: number;
    };
  }