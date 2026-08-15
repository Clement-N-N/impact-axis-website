import { defineArrayMember, defineField, defineType } from "sanity";
import { TESTIMONIAL_TYPE } from "../testimonial";

export const HOME_TESTIMONIALS_ID = "homeTestimonials";
export const HOME_TESTIMONIALS_TYPE = "homeTestimonials";

export const homeTestimonials = defineType({
  name: HOME_TESTIMONIALS_TYPE,
  title: "Home Page Testimonials",
  type: "document",
  fields: [
    defineField({
      name: "testimonials",
      title: "Testimonials",
      description: "Choose and order which testimonials appear in the home page carousel.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: TESTIMONIAL_TYPE }],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page Testimonials" };
    },
  },
});
