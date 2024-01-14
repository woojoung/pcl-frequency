/**
 * v0 by Vercel.
 * @see https://v0.dev/t/JQ1936cEKMT
 */
export default function Component() {
    return (
      <div className="bg-white flex h-screen w-screen flex-col items-center justify-center p-4">
        <img
          alt="Wave Maker logo"
          className="h-52 w-full object-cover"
          height="200"
          src="/placeholder.svg"
          style={{
            aspectRatio: "200/200",
            objectFit: "cover",
          }}
          width="200"
        />
        <h1 className="text-5xl font-bold">Wave Maker</h1>
        <p className="mt-2 text-xl">Break Time</p>
        <div className="mt-8 flex space-x-4">
          <img
            alt="Placeholder"
            className="h-24 w-24 bg-gray-300"
            height="100"
            src="/placeholder.svg"
            style={{
              aspectRatio: "100/100",
              objectFit: "cover",
            }}
            width="100"
          />
          <img
            alt="Placeholder"
            className="h-24 w-24 bg-gray-300"
            height="100"
            src="/placeholder.svg"
            style={{
              aspectRatio: "100/100",
              objectFit: "cover",
            }}
            width="100"
          />
          <img
            alt="Placeholder"
            className="h-24 w-24 bg-gray-300"
            height="100"
            src="/placeholder.svg"
            style={{
              aspectRatio: "100/100",
              objectFit: "cover",
            }}
            width="100"
          />
        </div>
      </div>
    )
  }
  
  