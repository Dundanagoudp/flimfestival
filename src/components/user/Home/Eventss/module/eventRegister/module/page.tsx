'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useForm } from 'react-hook-form';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { registerEvent } from '@/services/eventsService';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationData } from '@/types/registartionTypes';
import { useToast } from '@/components/ui/custom-toast';

const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    message: z.string().min(1),
});

export default function Eventpage() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
   const { showToast } = useToast();

   const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        email: '',
        phone: '',
        message: '',
    },
   });


   const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
        const registrationData: RegistrationData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
        };
        
        const response = await registerEvent(registrationData);
        setSubmitStatus({type: 'success', message: response.message || 'Registration successful!'});
        showToast(response.message, 'success');
        reset(); // Clear the form on success
    } catch (error: any) {
        setSubmitStatus({type: 'error', message: error.message || 'Registration failed. Please try again.'});
        showToast(error.message, 'error');
    } finally {
        setIsSubmitting(false);
    }
};
  return (
    <div>
         <main className="w-full px-4" style={{ backgroundColor: "#ffffff" }}>
         <div className="px-10 py-10 ">
            <div className='flex justify-around items-center'>
                <div>
                <img
                      src="video.png"
                      alt={`video `}
                      className="w-full h-full object-cover"
                      draggable="false"
                    />
          </div>
          <div>
            <Card className="rounded-2xl shadow-md p-6 bg-white">
        <CardContent className="w-[500px]">
          <h1 className="text-2xl font-bold mb-2">Register for Event</h1>
          <p className="text-gray-500 mb-6 text-sm">
            Fill all information details to consult with us to get services from us
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submitStatus && (
              <div className={`p-3 rounded-md text-sm ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}
            
            <div>
              <input
                placeholder="Fill Name"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-2 text-sm"
                {...register("name", { required: true })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-2 text-sm"
                {...register("email", { required: true })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">Valid email is required</p>}
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-2 text-sm"
                {...register("phone", { required: true })}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">Phone number is required</p>}
            </div>
            <div>
              <textarea
                placeholder="Message"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-2 text-sm resize-none"
                {...register("message")}
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">Message is required</p>}
            </div>

            <div className="flex items-center gap-2">
                <Button 
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-primary text-black hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div>
          </form>
        </CardContent>
      </Card>
          </div>

            </div>
            </div>
         </main>
    </div>
  )
}
