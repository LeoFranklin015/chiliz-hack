"use client";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Users,
  Upload,
  Tag,
  Loader2,
} from "lucide-react";
import { usePinataUpload } from "../test/usePinataUpload";
import { MerchContractAddress, MerchContractABI } from "../../lib/const";
import { walletClient, client } from "../../lib/client";
import { useAccount } from "wagmi";

// Merchandise type
type Merchandise = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  player: string;
  image: string;
  stock: string;
};

const MarketplacePage = () => {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [viewMode, setViewMode] = useState<"user" | "player">("user");
  const [isSubmittingMerch, setIsSubmittingMerch] = useState(false);
  const { address } = useAccount();

  // Initialize Pinata upload hook
  const {
    selectedFile,
    uploadedCID,
    isUploading,
    error: uploadError,
    fileValidation,
    uploadToPinata,
    handleFileSelect,
    getGatewayUrl,
  } = usePinataUpload();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "",
    },
  });

  // Sample merchandise data
  const sampleMerchandise: Merchandise[] = [
    {
      id: "1",
      name: "Messi Signature Jersey",
      description: "Official Barcelona home jersey signed by Lionel Messi",
      price: "299.99",
      category: "jerseys",
      player: "Lionel Messi",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      stock: "10",
    },
    {
      id: "2",
      name: "Ronaldo Training Kit",
      description:
        "Limited edition training kit from Cristiano Ronaldo's collection",
      price: "199.99",
      category: "training",
      player: "Cristiano Ronaldo",
      image:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
      stock: "5",
    },
  ];

  const categories = [
    { id: "jerseys", name: "Jerseys" },
    { id: "training", name: "Training Gear" },
    { id: "footwear", name: "Footwear" },
    { id: "accessories", name: "Accessories" },
  ];

  async function onSubmit(data: any) {
    if (!address || !walletClient) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!selectedFile) {
      alert("Please select an image for your merchandise!");
      return;
    }

    setIsSubmittingMerch(true);

    try {
      // Step 1: Upload image to Pinata
      console.log("Uploading image to Pinata...");
      const imageCID = await uploadToPinata();

      if (!imageCID) {
        throw new Error("Failed to upload image to Pinata");
      }

      // Step 2: Create metadata JSON
      const metadata = {
        name: data.name,
        description: data.description,
        image: `ipfs://${imageCID}`,
        attributes: [
          {
            trait_type: "Category",
            value: data.category,
          },
          {
            trait_type: "Price",
            value: `${data.price} CHZ`,
          },
          {
            trait_type: "Stock",
            value: data.stock,
          },
        ],
      };

      // Step 3: Upload metadata to Pinata
      console.log("Uploading metadata to Pinata...");
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });
      const metadataFile = new File([metadataBlob], "metadata.json", {
        type: "application/json",
      });

      // Upload metadata using the API
      const formData = new FormData();
      formData.append("file", metadataFile);

      const metadataResponse = await fetch("/api/upload-to-pinata", {
        method: "POST",
        body: formData,
      });

      const metadataResult = await metadataResponse.json();

      if (!metadataResult.success) {
        throw new Error("Failed to upload metadata to Pinata");
      }

      const metadataCID = metadataResult.IpfsHash || metadataResult.cid;
      console.log("Metadata uploaded with CID:", metadataCID);

      // Step 4: Create merchandise on blockchain
      console.log("Creating merchandise on blockchain...");

      // Convert form values to proper types
      const price = BigInt(data.price);
      const supply = BigInt(data.stock);
      // For now, using a default payment token address (you might want to let user choose)
      const paymentToken =
        "0x0000000000000000000000000000000000000000" as `0x${string}`; // ETH or native token

      console.log("Creating merchandise with params:", {
        name: data.name,
        ipfsMetadataCID: metadataCID,
        price,
        supply,
        paymentToken,
      });

      // Call the createMerch function on the merchandise contract
      const hash = await walletClient.writeContract({
        address: MerchContractAddress as `0x${string}`,
        abi: MerchContractABI,
        functionName: "createMerch",
        args: [data.name, metadataCID, price, supply, paymentToken],
        account: address as `0x${string}`,
      });

      console.log("Transaction hash:", hash);

      // Wait for transaction confirmation
      const receipt = await client.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed:", receipt);

      // Add to local state for immediate UI feedback
      const newMerchandise: Merchandise = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        player: "Your Name", // This would be the logged-in player's name
        image: getGatewayUrl(imageCID),
        stock: data.stock,
      };
      setMerchandise((prev) => [...prev, newMerchandise]);

      // Reset form
      form.reset();

      alert("Merchandise created successfully!");
    } catch (error) {
      console.error("Error creating merchandise:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`Error creating merchandise: ${errorMessage}`);
    } finally {
      setIsSubmittingMerch(false);
    }
  }

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

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex space-x-1 bg-zinc-900/80 rounded-2xl p-1 backdrop-blur-md border border-zinc-800/50 shadow-2xl">
            <button
              onClick={() => setViewMode("user")}
              className={`px-8 py-3 rounded-xl font-mono font-medium tracking-wide uppercase transition-all duration-300 ${
                viewMode === "user"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => setViewMode("player")}
              className={`px-8 py-3 rounded-xl font-mono font-medium tracking-wide uppercase transition-all duration-300 ${
                viewMode === "player"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              Sell
            </button>
          </div>
        </motion.div>

        {/* Create Form (Player Mode) */}
        {viewMode === "player" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="bg-zinc-900/95 border border-[#cf0a0a]/30 shadow-2xl rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-[linear-gradient(90deg,rgba(207,10,10,0.8)_0%,rgba(207,10,10,1)_100%)] rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#cf0a0a] gaming-text">
                    List Merchandise
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    Add your merchandise to the store
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200 font-semibold flex items-center space-x-2 mb-2">
                          <Tag className="w-4 h-4 text-[#cf0a0a]" />
                          <span>Product Name</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Signed Match Jersey"
                            className="bg-zinc-800/50 border-zinc-600 text-white placeholder-zinc-400 rounded-xl backdrop-blur-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200 font-semibold flex items-center space-x-2 mb-2">
                          <span>Description</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your product..."
                            className="bg-zinc-800/50 border-zinc-600 text-white placeholder-zinc-400 rounded-xl backdrop-blur-sm resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-200 font-semibold flex items-center space-x-2 mb-2">
                            <DollarSign className="w-4 h-4 text-[#cf0a0a]" />
                            <span>Price</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step="any"
                              placeholder="e.g. 299.99"
                              className="bg-zinc-800/50 border-zinc-600 text-white placeholder-zinc-400 rounded-xl backdrop-blur-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-200 font-semibold flex items-center space-x-2 mb-2">
                            <Users className="w-4 h-4 text-[#cf0a0a]" />
                            <span>Stock</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="e.g. 10"
                              className="bg-zinc-800/50 border-zinc-600 text-white placeholder-zinc-400 rounded-xl backdrop-blur-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200 font-semibold flex items-center space-x-2 mb-2">
                          <Tag className="w-4 h-4 text-[#cf0a0a]" />
                          <span>Category</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full bg-zinc-800/50 border-zinc-600 text-white rounded-xl backdrop-blur-sm px-4 py-3"
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200 font-semibold flex items-center space-x-2 mb-2">
                          <Upload className="w-4 h-4 text-[#cf0a0a]" />
                          <span>Product Image</span>
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex flex-col items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-600 rounded-xl cursor-pointer bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-300">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                                  <p className="mb-2 text-sm text-zinc-400">
                                    <span className="font-bold">
                                      Click to upload
                                    </span>{" "}
                                    or drag and drop
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                    PNG, JPG, GIF or WebP (MAX. 10MB)
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleFileSelect(e.target.files[0]);
                                    }
                                  }}
                                  disabled={isUploading}
                                  accept="image/*"
                                  {...field}
                                />
                              </label>
                            </div>
                            {fileValidation.message && (
                              <p className="text-orange-500 text-sm">
                                {fileValidation.message}
                              </p>
                            )}
                            {uploadError && (
                              <p className="text-red-500 text-sm">
                                {uploadError}
                              </p>
                            )}
                            {selectedFile && (
                              <div className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg">
                                <p className="text-zinc-400 text-sm truncate">
                                  Selected: {selectedFile.name}
                                </p>
                                {isUploading && (
                                  <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                                )}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isUploading || isSubmittingMerch || !selectedFile}
                    className="w-full bg-[linear-gradient(90deg,rgba(207,10,10,0.2)_0%,rgba(207,10,10,0.4)_100%)] text-[#cf0a0a] font-bold hover:bg-[linear-gradient(90deg,rgba(207,10,10,0.4)_0%,rgba(207,10,10,0.6)_100%)] hover:text-white transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmittingMerch ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : isUploading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      "Create Listing"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        )}

        {/* Merchandise Grid */}
        {viewMode === "user" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {sampleMerchandise.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="bg-zinc-900/80 border-[#cf0a0a]/30 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.name}
                      </h3>
                      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-[#cf0a0a]">
                          ${item.price}
                        </div>
                        <div className="text-zinc-400 text-sm">
                          {item.stock} in stock
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
                        <div className="text-sm text-zinc-400">
                          By: {item.player}
                        </div>
                        <Button className="bg-[linear-gradient(90deg,rgba(207,10,10,0.2)_0%,rgba(207,10,10,0.4)_100%)] text-[#cf0a0a] hover:bg-[linear-gradient(90deg,rgba(207,10,10,0.4)_0%,rgba(207,10,10,0.6)_100%)] hover:text-white transition-all duration-300">
                          Buy Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
