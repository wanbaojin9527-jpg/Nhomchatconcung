
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Sử dụng các khóa bạn đã cung cấp
const supabaseUrl = 'https://jxdprnrilzvaummdevre.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4ZHBybnJpbHp2YXVtbWRldnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzExMDIsImV4cCI6MjA4Mjg0NzEwMn0.fsPxDaXEA6rbjBP_EcQ2vUHNG7dt0HqQAwLAncWKSVU';

export const isSupabaseConfigured = true;

// Khởi tạo client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Connect Plus: Đã kết nối với Cloud Database (jxdprnrilzvaummdevre)");
