import { supabase } from "@/integrations/supabase/client";

export const createCardImagesBucket = async () => {
  const { data, error } = await supabase
    .storage
    .createBucket('card-images', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
    });

  if (error) {
    console.error('Error creating bucket:', error);
    return false;
  }

  return true;
};