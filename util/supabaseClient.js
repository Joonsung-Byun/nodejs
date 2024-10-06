const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://kdveyjcirwpqjcgtehew.supabase.co"
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdmV5amNpcndwcWpjZ3RlaGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwMTE2NTAsImV4cCI6MjA0MzU4NzY1MH0.koTVCU2P7lLGEPmtb3g-vWuQcxJ3QDTqCK3Na4YhO3E'

const supabaseDB = createClient(supabaseUrl, supabaseKey)

module.exports = { supabaseDB };

