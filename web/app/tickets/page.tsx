"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
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

// Ticket type
type Ticket = {
  match: string;
  seat: string;
  quantity: string;
  price: string;
};

const page = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const form = useForm({
    defaultValues: {
      match: "",
      seat: "",
      quantity: "",
      price: "",
    },
  });

  function onSubmit(data: Ticket) {
    setTickets((prev) => [...prev, data]);
    form.reset();
  }

  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Decorative blurred circles */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl z-0"></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-cyan-400/10 to-purple-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-full px-6 py-3 mb-6">
            <span className="text-2xl">🎟️</span>
            <span className="text-white font-semibold">TICKETS</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            List Your <span className="text-green-400">Tickets</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Offer your fans a seat at the match! Create and list tickets with
            custom info and pricing. All tickets are securely managed and
            beautifully displayed.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-6 text-lg px-8 py-4 font-bold bg-gradient-to-r from-green-400 to-cyan-500 text-white shadow-lg hover:from-cyan-500 hover:to-green-400 transition-all duration-300">
                + Create Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="backdrop-blur-xl border-cyan-400/30 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-cyan-400">
                  List a Ticket for Your Fans
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="match"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Match Data</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. Team A vs Team B, 2024-06-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seat"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Ticket / Seat Info</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Section 101, Row 5, Seat 8"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="e.g. 1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="any"
                            placeholder="e.g. 50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-400 to-green-400 text-white font-bold py-3 rounded-lg shadow-lg hover:from-green-400 hover:to-cyan-400 transition-all duration-300"
                    >
                      Create Ticket
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </motion.div>
        <div className="mt-10 grid gap-8">
          {tickets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground text-lg"
            >
              No tickets listed yet.
            </motion.div>
          )}
          <AnimatePresence>
            {tickets.map((ticket, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-cyan-500/10 to-green-500/10 border-cyan-400/30 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                      <span>🎫</span> {ticket.match}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-lg text-white">
                      <strong>Seat:</strong>{" "}
                      <span className="text-cyan-300">{ticket.seat}</span>
                    </div>
                    <div className="mb-2 text-lg text-white">
                      <strong>Quantity:</strong>{" "}
                      <span className="text-green-300">{ticket.quantity}</span>
                    </div>
                    <div className="text-lg text-white">
                      <strong>Price:</strong>{" "}
                      <span className="text-yellow-300">{ticket.price}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default page;
