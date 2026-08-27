export type College = { id: string; name: string; shortName: string; city: string; state: string; type: string; established: number; rating: number; reviews: number; fees: string; courses: string[]; tags: string[]; description: string; accent: string; }; 
export type CollegeFilters = { q?: string; city?: string; type?: string; course?: string; sort?: string };
