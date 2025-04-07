import BBImage from "@/components/common/bbImage.component";

export default function MyNameIsError404() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <BBImage src="images/I_am_Error.png" alt="I am Error. From Zelda II." />
    </div>
  );
}
