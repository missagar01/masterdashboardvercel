

// import { createClient } from "@supabase/supabase-js";

// const supabaseURL =import.meta.env.VITE_SUPABASE_URL
// const supabaseKey=import.meta.env.VITE_SUPABASE_ANON_KEY 
// const supabase =  createClient(supabaseURL,supabaseKey)    

// export default supabase;



let supabaseProxy = null;

export const setSupabaseClient = (client) => {
  supabaseProxy = client;
};

export const getSupabaseClient = () => {
  if (!supabaseProxy) {
    throw new Error('Supabase client has not been initialized.');
  }
  return supabaseProxy;
};

const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      const client = getSupabaseClient();
      const value = client[prop];
      return typeof value === 'function' ? value.bind(client) : value;
    },
  }
);

export default supabase;


// import { createClient } from "@supabase/supabase-js";

// const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
// const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY; // service_role
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // anon

// const supabase = createClient(
//   supabaseURL,
//   import.meta.env.DEV ? supabaseServiceKey : supabaseAnonKey, // 👈 use service locally, anon on live
//   { realtime: { params: { eventsPerSecond: 10 } } }
// );

// export default supabase;
