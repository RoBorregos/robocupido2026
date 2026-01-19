import { HomeIcon, BarChart, Instagram, Globe} from "lucide-react";

export const socialNetworks = [
    {
        id: 1,
        logo: <Instagram size={30} strokeWidth={1} />,
        src: "https://www.instagram.com/roborregos/",
    },
    {
        id: 2,
        logo: <Globe size={30} strokeWidth={1} />,
        src: "https://roborregos.com/",
    }
];


export const itemsNavbar = [
    {
        id: 1,
        title: "Home",
        icon: <HomeIcon size={25} color="#fff" strokeWidth={1} />,
        link: "/",
    },
    {
        id: 2,
        title: "Charts",
        icon: <BarChart size={25} color="#fff" strokeWidth={1} />,
        link: "/about-me",
    },
];