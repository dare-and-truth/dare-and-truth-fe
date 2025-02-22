import { supabaseClient } from '@/app/utils/Supabase';
import { v4 as uuidv4 } from 'uuid';

const supabase = supabaseClient;

export const uploadFileToSupabase = async (file: File | null) => {
  if (!file) return null;
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(fileName, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};
