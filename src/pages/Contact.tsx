
// import Seo from "@/components/Seo";
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import axios from "axios";

// export default function Contact() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmitContact = async () => {
//     if (!name || !email || !message) {
//       toast.error("Please fill all fields.", { variant: "destructive" });
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5050/api/user/contact",
//         {
//           name,
//           email,
//           message,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
            
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );
//       if (response.data.success) {
//         toast.success("Message sent successfully!");
//         setName("");
//         setEmail("");
//         setMessage("");
//       } else {
//         throw new Error(response.data.message || "Failed to send message");
//       }
//     } catch (err: any) {
//       if (err.response?.status === 400) {
//         toast.error("Missing required fields. Please check your input.", {
//           variant: "destructive",
//         });
//       } else {
//         toast.error(
//           err.response?.data?.message ||
//             "Failed to send message. Please try again.",
//           { variant: "destructive" }
//         );
//       }
//     }
//   };

//   return (
//     <>
//       <Seo
//         title="Contact Us | EstateHub"
//         description="Get in touch with EstateHub. Send us a message, call or email, and find our office location on the map."
//         canonicalPath="/contact"
//       />
//       <header>
//         <h1 className="text-3xl font-bold">Contact</h1>
//         <p className="text-muted-foreground mt-2">
//           We'd love to hear from you. Fill the form or reach us directly.
//         </p>
//       </header>

//       <section className="mt-6 grid gap-8 md:grid-cols-3">
//         <div className="md:col-span-2 bg-card p-4 rounded-lg space-y-3">
//           <Input
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <Input
//             placeholder="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Textarea
//             placeholder="Message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <Button onClick={handleSubmitContact}>Send</Button>
//         </div>
//         <aside className="space-y-3">
//           <div className="p-4 rounded-lg border">
//             <p className="font-semibold">Phone</p>
//             <p className="text-muted-foreground">+1 (555) 123-4567</p>
//             <p className="font-semibold mt-2">Email</p>
//             <p className="text-muted-foreground">hello@estatehub.com</p>
//           </div>
//           <div className="rounded-lg overflow-hidden border">
//             <iframe
//               title="Office Location"
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//               className="w-full h-64"
//               src="https://www.openstreetmap.org/export/embed.html?bbox=-122.45%2C37.76%2C-122.40%2C37.80&layer=mapnik&marker=37.78%2C-122.425"
//             ></iframe>
//           </div>
//         </aside>
//       </section>
//     </>
//   );
// }
import Seo from "@/components/Seo";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";

export default function Contact() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmitContact = async () => {
    if (!name) {
      toast({
        title: "Missing Name",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Missing Email",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!message) {
      toast({
        title: "Missing Message",
        description: "Please enter your message.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Submitting contact form to: /api/user/contact", {
        name,
        email,
        message,
      });
      const response = await api.post(
        "/api/user/contact",
        {
          name,
          email,
          message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Contact API response:", response.data);

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Message sent successfully!",
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(response.data.message || "Failed to send message");
      }
    } catch (err: any) {
      console.error("Contact form error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        baseURL: api.defaults.baseURL,
      });
      let errorMsg = "Failed to send message. Please try again.";
      if (err.response?.status === 400) {
        errorMsg = "Missing required fields. Please check your input.";
      } else if (err.response?.status === 404) {
        errorMsg = "Contact endpoint not found at /api/user/contact.";
      } else if (err.response?.status === 401) {
        errorMsg = "Unauthorized: Please try again or contact support.";
      }
      toast({
        title: "Error",
        description: err.response?.data?.message || errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact Us | EstateHub"
        description="Get in touch with EstateHub. Send us a message, call or email, and find our office location on the map."
        canonicalPath="/contact"
      />
      <header role="banner" aria-label="Contact page header">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-muted-foreground mt-2">
          We'd love to hear from you. Fill the form or reach us directly.
        </p>
      </header>

      <section className="mt-6 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 bg-card p-4 rounded-lg space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSubmitContact}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </div>
        <aside className="space-y-3">
          <div className="p-4 rounded-lg border">
            <p className="font-semibold">Phone</p>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
            <p className="font-semibold mt-2">Email</p>
            <p className="text-muted-foreground">hello@estatehub.com</p>
          </div>
          <div className="rounded-lg overflow-hidden border">
            <iframe
              title="Office Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-64"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-122.45%2C37.76%2C-122.40%2C37.80&layer=mapnik&marker=37.78%2C-122.425"
            ></iframe>
          </div>
        </aside>
      </section>
    </>
  );
}