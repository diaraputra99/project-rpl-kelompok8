const { createClient } = supabase

const supabaseUrl = 'https://eajanzfjjrlmcepdabio.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhamFuemZqanJsbWNlcGRhYmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjEyNzUsImV4cCI6MjA5MzY5NzI3NX0.hAPdTfzglV90zOmyiitR5ACowxX8eu0bQ28-wSN7MIo'

const _supabase = createClient(supabaseUrl, supabaseKey)

console.log("Sistem RestoFlow Terhubung ke Supabase!")