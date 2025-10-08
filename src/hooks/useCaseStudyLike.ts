import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const LIKED_STUDIES_KEY = 'likedCaseStudies';

export const useCaseStudyLike = (caseStudyId: string, initialLikes: number) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Check if user has already liked this case study
    const likedStudies = JSON.parse(localStorage.getItem(LIKED_STUDIES_KEY) || '[]');
    setIsLiked(likedStudies.includes(caseStudyId));
  }, [caseStudyId]);

  const handleLike = async () => {
    if (isLiked) return; // Prevent multiple likes

    try {
      // Call the database function to increment likes
      const { data, error } = await supabase.rpc('increment_case_study_likes', {
        case_study_id: caseStudyId
      });

      if (error) throw error;

      if (data !== null) {
        setLikes(data);
        setIsLiked(true);

        // Store in localStorage
        const likedStudies = JSON.parse(localStorage.getItem(LIKED_STUDIES_KEY) || '[]');
        likedStudies.push(caseStudyId);
        localStorage.setItem(LIKED_STUDIES_KEY, JSON.stringify(likedStudies));
      }
    } catch (error) {
      console.error('Error liking case study:', error);
    }
  };

  return { likes, isLiked, handleLike };
};
