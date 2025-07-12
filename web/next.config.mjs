/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.stickpng.com",
        port: "",
        pathname: "/images/**",
      },
    
   
        {
          protocol: "https",
          hostname: "img.lemde.fr",
          port: "",
          pathname: "/**",
        },]
      
  },
}

export default nextConfig 