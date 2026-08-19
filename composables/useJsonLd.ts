interface OrganizationInput {
    name?: string;
    url?: string;
    logo?: string;
    sameAs?: string[];
}

interface BreadcrumbEntry {
    name: string;
    url: string;
}

interface ServiceInput {
    name: string;
    description: string;
    url: string;
    provider?: string;
    areaServed?: string;
    serviceType?: string;
}

interface FaqEntry {
    question: string;
    answer: string;
}

interface ApartmentInput {
    name: string;
    description: string;
    url: string;
    floorSize?: number;
    numberOfRooms?: number;
    numberOfBedrooms?: number;
    numberOfBathroomsTotal?: number;
    amenities?: string[];
}

interface TouristTripInput {
    name: string;
    description: string;
    url: string;
    itinerary?: string[];
    touristType?: string[];
}

interface AboutPageInput {
    url: string;
    name: string;
    description: string;
    inLanguage?: string;
}

interface ContactPageInput {
    url: string;
    name: string;
    description: string;
    inLanguage?: string;
    telephone?: string | string[];
    email?: string;
}

interface ReviewInput {
    author: string;
    body: string;
    ratingValue?: number;
}

interface PersonInput {
    name: string;
    jobTitle?: string;
    description?: string;
    sameAs?: string[];
    worksFor?: string;
}

interface LocalBusinessInput {
    name?: string;
    description?: string;
    telephone?: string | string[];
    email?: string;
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
    streetAddress?: string;
    postalCode?: string;
    geoLat?: number;
    geoLng?: number;
    sameAs?: string[];
    openingHours?: Array<{ days: string[]; opens: string; closes: string }>;
    areaServed?: string[];
}

const inject = (id: string, json: Record<string, unknown>) => {
    useHead({
        script: [
            {
                key: id,
                type: "application/ld+json",
                innerHTML: JSON.stringify(json),
            },
        ],
    });
};

export const useJsonLd = () => {
    const config = useRuntimeConfig();
    const app = useAppConfig();
    const { locale } = useI18n();
    const siteUrl = config.public.siteUrl;
    const brandName = app.brand.name;
    const contact = app.contact;
    const logoUrl = `${siteUrl}/og-default.png`;

    const languageTag = () => (locale.value === "ru" ? "ru-RU" : "en-US");

    const socialProfiles = () => {
        const profiles: string[] = [];
        if (contact.whatsapp) profiles.push(`https://wa.me/${contact.whatsapp}`);
        if (contact.telegram) profiles.push(`https://t.me/+${contact.telegram}`);
        if (contact.instagram) profiles.push(`https://instagram.com/${contact.instagram}`);
        return profiles;
    };

    const organization = (input: OrganizationInput = {}) => {
        inject("ld-organization", {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: input.name ?? brandName,
            url: input.url ?? siteUrl,
            logo: input.logo ?? logoUrl,
            sameAs: input.sameAs ?? socialProfiles(),
        });
    };

    const website = () => {
        inject("ld-website", {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            name: brandName,
            url: siteUrl,
            inLanguage: ["en-US", "ru-RU"],
            publisher: { "@id": `${siteUrl}/#organization` },
        });
    };

    const localBusiness = (input: LocalBusinessInput = {}) => {
        const json: Record<string, unknown> = {
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            "@id": `${siteUrl}/#localbusiness`,
            name: input.name ?? brandName,
            url: siteUrl,
            image: logoUrl,
            logo: logoUrl,
        };

        if (input.description) json.description = input.description;

        const telephone = input.telephone ?? `+${contact.whatsapp}`;
        json.telephone = Array.isArray(telephone) ? telephone : [telephone];

        const email = input.email ?? contact.email;
        if (email) json.email = email;

        const address: Record<string, unknown> = {
            "@type": "PostalAddress",
            addressCountry: input.addressCountry ?? contact.country,
        };
        if (input.addressLocality ?? contact.city) {
            address.addressLocality = input.addressLocality ?? contact.city;
        }
        if (input.addressRegion ?? contact.region) {
            address.addressRegion = input.addressRegion ?? contact.region;
        }
        if (input.streetAddress) address.streetAddress = input.streetAddress;
        if (input.postalCode) address.postalCode = input.postalCode;
        json.address = address;

        if (typeof input.geoLat === "number" && typeof input.geoLng === "number") {
            json.geo = {
                "@type": "GeoCoordinates",
                latitude: input.geoLat,
                longitude: input.geoLng,
            };
        }

        const hours = input.openingHours ?? [
            {
                days: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
                opens: contact.opensAt,
                closes: contact.closesAt,
            },
        ];
        json.openingHoursSpecification = hours.map((entry) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: entry.days,
            opens: entry.opens,
            closes: entry.closes,
        }));

        const sameAs = input.sameAs ?? socialProfiles();
        if (sameAs.length > 0) json.sameAs = sameAs;

        if (input.areaServed && input.areaServed.length > 0) {
            json.areaServed = input.areaServed.map((name) => ({ "@type": "Place", name }));
        }

        inject("ld-localbusiness", json);
    };

    const breadcrumbList = (entries: BreadcrumbEntry[]) => {
        inject("ld-breadcrumb", {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: entries.map((entry, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: entry.name,
                item: entry.url,
            })),
        });
    };

    const service = (input: ServiceInput) => {
        const json: Record<string, unknown> = {
            "@context": "https://schema.org",
            "@type": "Service",
            name: input.name,
            description: input.description,
            url: input.url,
            provider: {
                "@type": "LodgingBusiness",
                "@id": `${siteUrl}/#localbusiness`,
                name: input.provider ?? brandName,
                url: siteUrl,
            },
        };
        if (input.serviceType) json.serviceType = input.serviceType;
        if (input.areaServed) {
            json.areaServed = { "@type": "Place", name: input.areaServed };
        }
        inject("ld-service", json);
    };

    const taxiService = (input: ServiceInput) => {
        const json: Record<string, unknown> = {
            "@context": "https://schema.org",
            "@type": "TaxiService",
            name: input.name,
            description: input.description,
            url: input.url,
            provider: {
                "@type": "LodgingBusiness",
                "@id": `${siteUrl}/#localbusiness`,
                name: input.provider ?? brandName,
                url: siteUrl,
            },
        };
        if (input.areaServed) {
            json.areaServed = { "@type": "Place", name: input.areaServed };
        }
        inject("ld-taxiservice", json);
    };

    const apartmentNode = (input: ApartmentInput): Record<string, unknown> => {
        const node: Record<string, unknown> = {
            "@type": "Apartment",
            name: input.name,
            description: input.description,
            url: input.url,
        };
        if (typeof input.floorSize === "number") {
            node.floorSize = {
                "@type": "QuantitativeValue",
                value: input.floorSize,
                unitCode: "MTK",
            };
        }
        if (typeof input.numberOfRooms === "number") node.numberOfRooms = input.numberOfRooms;
        if (typeof input.numberOfBedrooms === "number") {
            node.numberOfBedrooms = input.numberOfBedrooms;
        }
        if (typeof input.numberOfBathroomsTotal === "number") {
            node.numberOfBathroomsTotal = input.numberOfBathroomsTotal;
        }
        if (input.amenities?.length) {
            node.amenityFeature = input.amenities.map((name) => ({
                "@type": "LocationFeatureSpecification",
                name,
                value: true,
            }));
        }
        return node;
    };

    const touristTripNode = (input: TouristTripInput): Record<string, unknown> => {
        const node: Record<string, unknown> = {
            "@type": "TouristTrip",
            name: input.name,
            description: input.description,
            url: input.url,
            provider: {
                "@type": "LodgingBusiness",
                "@id": `${siteUrl}/#localbusiness`,
                name: brandName,
                url: siteUrl,
            },
        };
        if (input.itinerary?.length) {
            node.itinerary = {
                "@type": "ItemList",
                itemListElement: input.itinerary.map((name, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: { "@type": "Place", name },
                })),
            };
        }
        if (input.touristType?.length) node.touristType = input.touristType;
        return node;
    };

    const apartmentList = (items: ApartmentInput[], listName: string) => {
        inject("ld-apartment-list", {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: listName,
            itemListElement: items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: apartmentNode(item),
            })),
        });
    };

    const touristTripList = (items: TouristTripInput[], listName: string) => {
        inject("ld-tour-list", {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: listName,
            itemListElement: items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: touristTripNode(item),
            })),
        });
    };

    const faqPage = (items: FaqEntry[]) => {
        if (!items.length) return;
        inject("ld-faq", {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                },
            })),
        });
    };

    const itemList = (
        items: Array<{ name: string; url: string; description?: string }>,
        listName?: string,
    ) => {
        inject("ld-itemlist", {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: listName ?? brandName,
            itemListElement: items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                url: item.url,
                ...(item.description ? { description: item.description } : {}),
            })),
        });
    };

    const reviewCollection = (items: ReviewInput[]) => {
        if (items.length === 0) return;
        const ratings = items.map((item) => item.ratingValue ?? 5);
        const average = ratings.reduce((sum, value) => sum + value, 0) / ratings.length;

        inject("ld-reviews", {
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            "@id": `${siteUrl}/#localbusiness`,
            name: brandName,
            url: siteUrl,
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: Number(average.toFixed(1)),
                reviewCount: items.length,
                bestRating: 5,
                worstRating: 1,
            },
            review: items.map((item) => ({
                "@type": "Review",
                author: { "@type": "Person", name: item.author },
                reviewBody: item.body,
                reviewRating: {
                    "@type": "Rating",
                    ratingValue: item.ratingValue ?? 5,
                    bestRating: 5,
                    worstRating: 1,
                },
            })),
        });
    };

    const aboutPage = (input: AboutPageInput) => {
        inject("ld-aboutpage", {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": `${input.url}#aboutpage`,
            url: input.url,
            name: input.name,
            description: input.description,
            inLanguage: input.inLanguage ?? languageTag(),
            isPartOf: { "@id": `${siteUrl}/#website` },
            about: { "@id": `${siteUrl}/#organization` },
        });
    };

    const contactPage = (input: ContactPageInput) => {
        const phones = input.telephone
            ? Array.isArray(input.telephone)
                ? input.telephone
                : [input.telephone]
            : [];
        const contactPoints = phones.map((telephone) => ({
            "@type": "ContactPoint",
            telephone,
            contactType: "customer service",
            availableLanguage: ["en", "ru"],
            ...(input.email ? { email: input.email } : {}),
        }));

        inject("ld-contactpage", {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "@id": `${input.url}#contactpage`,
            url: input.url,
            name: input.name,
            description: input.description,
            inLanguage: input.inLanguage ?? languageTag(),
            isPartOf: { "@id": `${siteUrl}/#website` },
            ...(contactPoints.length > 0 ? { contactPoint: contactPoints } : {}),
        });
    };

    const person = (input: PersonInput, index = 0) => {
        const json: Record<string, unknown> = {
            "@context": "https://schema.org",
            "@type": "Person",
            name: input.name,
            worksFor: {
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                name: input.worksFor ?? brandName,
                url: siteUrl,
            },
        };
        if (input.jobTitle) json.jobTitle = input.jobTitle;
        if (input.description) json.description = input.description;
        if (input.sameAs?.length) json.sameAs = input.sameAs;
        inject(`ld-person-${index}`, json);
    };

    return {
        organization,
        website,
        localBusiness,
        breadcrumbList,
        service,
        taxiService,
        apartmentList,
        touristTripList,
        faqPage,
        itemList,
        reviewCollection,
        aboutPage,
        contactPage,
        person,
    };
};
