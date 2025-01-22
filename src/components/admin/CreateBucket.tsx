import { supabase } from "@/integrations/supabase/client";

export const createCardImagesBucket = async () => {
  // First check if bucket exists
  const { data: buckets, error: listError } = await supabase
    .storage
    .listBuckets();

  if (listError) {
    console.error('Error checking buckets:', listError);
    return false;
  }

  const bucketExists = buckets.some(bucket => bucket.name === 'card-images');
  
  if (bucketExists) {
    console.log('Bucket card-images already exists');
    return true;
  }

  // If bucket doesn't exist, create it
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