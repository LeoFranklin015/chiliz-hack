"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { ShoppingBag, DollarSign, Users, Loader2 } from "lucide-react";
import { MerchContractAddress, MerchContractABI } from "../../lib/const";
import { client } from "../../lib/client";
import { useAccount } from "wagmi";

// Merchandise type based on the smart contract MerchInfo struct
type Merchandise = {
  id: string;
  name: string;
  ipfsMetadataCID: string;
  price: string;
  supply: string;
  minted: string;
  seller: string;
  paymentToken: string;
  image?: string;
  description?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
};

const MarketplacePage = () => {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  // Function to fetch all merchandise from the smart contract
  const fetchAllMerch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching merchandise from contract...");

      // Call the listAllMerch function from the smart contract
      const result = await client.readContract({
        address: MerchContractAddress as `0x${string}`,
        abi: MerchContractABI,
        functionName: "listAllMerch",
      });

      console.log("Raw contract result:", result);

      // Transform the result to match our Merchandise type
      const transformedMerch = await Promise.all(
        (result as any[]).map(async (item: any) => {
          let imageUrl = "";
          let description = "Merchandise item";
          let attributes: any[] = [];

          try {
            // Fetch metadata from IPFS
            const metadataUrl = `https://gateway.pinata.cloud/ipfs/${item.ipfsMetadataCID}`;
            const metadataResponse = await fetch(metadataUrl);

            if (metadataResponse.ok) {
              const metadata = await metadataResponse.json();
              console.log(
                "Metadata for item",
                item.id.toString(),
                ":",
                metadata
              );

              // Extract image CID from metadata
              if (metadata.image) {
                // Handle both ipfs:// and direct CID formats
                const imageCID = metadata.image.replace("ipfs://", "");
                imageUrl = `https://gateway.pinata.cloud/ipfs/${imageCID}`;
              }

              // Extract description and attributes
              description = metadata.description || "Merchandise item";
              attributes = metadata.attributes || [];
            }
          } catch (metadataError) {
            console.error(
              "Error fetching metadata for item",
              item.id.toString(),
              ":",
              metadataError
            );
            // Fallback to placeholder if metadata fetch fails
            imageUrl = "/api/placeholder/400/300";
          }

          return {
            id: item.id.toString(),
            name: item.name,
            ipfsMetadataCID: item.ipfsMetadataCID,
            price: item.price.toString(),
            supply: item.supply.toString(),
            minted: item.minted.toString(),
            seller: item.seller,
            paymentToken: item.paymentToken,
            image: imageUrl,
            description: description,
            attributes: attributes,
          };
        })
      );

      console.log("Transformed merchandise:", transformedMerch);
      setMerchandise(transformedMerch);
    } catch (error) {
      console.error("Error fetching merchandise:", error);
      setError("Failed to fetch merchandise. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch merchandise on component mount
  useEffect(() => {
    fetchAllMerch();
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Gaming Background Effects */}
      <div className="dots-bg" />

      {/* Decorative Gaming Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-[linear-gradient(90deg,rgba(207,10,10,0.2)_0%,rgba(207,10,10,0.4)_100%)] rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-[linear-gradient(90deg,rgba(207,10,10,0.2)_0%,rgba(207,10,10,0.4)_100%)] rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-[linear-gradient(90deg,rgba(207,10,10,0.1)_0%,rgba(207,10,10,0.2)_100%)] rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-full px-8 py-4 mb-8 shadow-2xl">
            <ShoppingBag className="w-6 h-6 text-[#cf0a0a]" />
            <span className="text-white font-mono font-bold tracking-wider uppercase text-lg">
              PLAYER MERCHANDISE
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 gaming-text">
            Official <span className="text-white">Fan Store</span>
          </h1>

          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Exclusive merchandise from your favorite players. From signed
            jerseys to limited edition gear, find authentic items to show your
            support.
          </p>
        </motion.div>

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <Button
            onClick={fetchAllMerch}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-mono font-medium tracking-wide uppercase transition-all duration-300 shadow-lg shadow-red-500/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh Merchandise"
            )}
          </Button>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#cf0a0a] animate-spin mx-auto mb-4" />
              <p className="text-zinc-300 text-lg">Loading merchandise...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <Button
                onClick={fetchAllMerch}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Merchandise Grid */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {merchandise.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <ShoppingBag className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
                <p className="text-zinc-400 text-lg">
                  No merchandise available yet.
                </p>
                <p className="text-zinc-500 text-sm mt-2">
                  Check back later for new items!
                </p>
              </div>
            ) : (
              merchandise.map(
                (item) => (
                  console.log(item),
                  (
                    <Card
                      key={item.id}
                      className="bg-zinc-900/95 border-zinc-800/50 hover:border-[#cf0a0a]/50 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm shadow-xl overflow-hidden group"
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={item.image || "/api/placeholder/400/300"}
                            alt={item.name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between text-white">
                              <span className="text-sm font-medium bg-[#cf0a0a]/80 px-2 py-1 rounded-md">
                                {item.minted}/{item.supply} sold
                              </span>
                              <span className="text-lg font-bold">
                                {parseInt(item.price)} CHZ
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#cf0a0a] transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Display metadata attributes */}
                          {item.attributes && item.attributes.length > 0 && (
                            <div className="mb-4 space-y-2">
                              {item.attributes.map((attr, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-zinc-500">
                                    {attr.trait_type}:
                                  </span>
                                  <span className="text-zinc-300 font-medium">
                                    {attr.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-zinc-400 text-sm">
                              <Users className="w-4 h-4 mr-1" />
                              Stock:{" "}
                              {parseInt(item.supply) - parseInt(item.minted)}
                            </div>
                            <div className="text-xs text-zinc-500">
                              ID: {item.id}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-zinc-500">
                              Seller: {item.seller.slice(0, 6)}...
                              {item.seller.slice(-4)}
                            </div>
                            <Button
                              className="bg-[#cf0a0a] hover:bg-[#cf0a0a]/80 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                              disabled={
                                parseInt(item.minted) >= parseInt(item.supply)
                              }
                            >
                              {parseInt(item.minted) >= parseInt(item.supply)
                                ? "Sold Out"
                                : "Buy Now"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )
              )
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
