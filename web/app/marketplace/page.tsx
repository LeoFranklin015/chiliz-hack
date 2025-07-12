"use client";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
} from "../components/ui/card";
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
} from "lucide-react";

// Merchandise type
type Merchandise = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  player: string;
  image: string;
  tokenAmount: string,
};

const MarketplacePage = () => {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [viewMode, setViewMode] = useState<"user" | "player">("user");

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      tokenAmount: "",
      image: "",
    },
  });

  // Sample merchandise data
  const sampleMerchandise: Merchandise[] = [
    {
      id: "1",
      name: "Messi Player Tokens",
      description: "Official Barcelona player tokens for Lionel Messi",
      price: "299.99",
      category: "player_tokens",
      player: "Lionel Messi",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      tokenAmount: "1000",
    },
    {
      id: "2",
      name: "Ronaldo Player Tokens",
      description: "Limited edition player tokens from Cristiano Ronaldo",
      price: "199.99",
      category: "player_tokens",
      player: "Cristiano Ronaldo",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
      tokenAmount: "500",
    },
  ];

  const categories = [
    { id: "player_tokens", name: "Player Tokens" },
  ];

  function onSubmit(data: any) {
    const newMerchandise: Merchandise = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      player: "Your Name", // This would be the logged-in player's name
      image: data.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      tokenAmount: data.tokenAmount,
    };
    setMerchandise((prev) => [...prev, newMerchandise]);
    form.reset();
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
              PLAYER TOKEN MARKETPLACE
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 gaming-text">
            Player <span className="text-white">Tokens</span>
          </h1>

          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Buy and sell player tokens to support your favorite players and earn rewards.
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
              Browse
            </button>
            <button
              onClick={() => setViewMode("player")}
              className={`px-8 py-3 rounded-xl font-mono font-medium tracking-wide uppercase transition-all duration-300 ${
                viewMode === "player"
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              Create
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
                    Create Token Listing
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    List your player tokens for sale
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200 font-semibold flex items-center space-x-2 mb-2">
                          <Tag className="w-4 h-4 text-[#cf0a0a]" />
                          <span>Token Name</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Player Name Tokens"
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
                            placeholder="Describe your token listing..."
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
                            <span>Price per Token</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step="any"
                              placeholder="e.g. 0.01"
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
                      name="tokenAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-200 font-semibold flex items-center space-x-2 mb-2">
                            <Users className="w-4 h-4 text-[#cf0a0a]" />
                            <span>Token Amount</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="e.g. 1000"
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
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-200 font-semibold flex items-center space-x-2 mb-2">
                          <Upload className="w-4 h-4 text-[#cf0a0a]" />
                          <span>Player Image URL</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            className="bg-zinc-800/50 border-zinc-600 text-white placeholder-zinc-400 rounded-xl backdrop-blur-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[linear-gradient(90deg,rgba(207,10,10,0.2)_0%,rgba(207,10,10,0.4)_100%)] text-[#cf0a0a] font-bold hover:bg-[linear-gradient(90deg,rgba(207,10,10,0.4)_0%,rgba(207,10,10,0.6)_100%)] hover:text-white transition-all duration-300"
                  >
                    Create Listing
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        )}

        {/* Token Grid */}
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
                          {item.tokenAmount} tokens
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
                        <div className="text-sm text-zinc-400">
                          Seller: {item.player}
                        </div>
                        <Button 
                          className="bg-[linear-gradient(90deg,rgba(207,10,10,0.2)_0%,rgba(207,10,10,0.4)_100%)] text-[#cf0a0a] hover:bg-[linear-gradient(90deg,rgba(207,10,10,0.4)_0%,rgba(207,10,10,0.6)_100%)] hover:text-white transition-all duration-300"
                        >
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
