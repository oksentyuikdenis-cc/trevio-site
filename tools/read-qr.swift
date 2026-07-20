import Foundation
import Vision
import AppKit

// Decodes any barcodes in the images given as arguments, using the system
// Vision framework so no third-party dependency is needed.
for path in CommandLine.arguments.dropFirst() {
    guard let image = NSImage(contentsOfFile: path),
          let tiff = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiff),
          let cg = bitmap.cgImage
    else {
        print("\(path)\tCOULD NOT LOAD")
        continue
    }

    let request = VNDetectBarcodesRequest()
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    do {
        try handler.perform([request])
        let results = request.results ?? []
        if results.isEmpty {
            print("\(path)\tNO BARCODE FOUND")
        }
        for r in results {
            print("\(path)\t\(r.symbology.rawValue)\t\(r.payloadStringValue ?? "<no payload>")")
        }
    } catch {
        print("\(path)\tERROR \(error)")
    }
}
