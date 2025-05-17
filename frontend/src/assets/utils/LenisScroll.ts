import Lenis from "lenis";

export const LenisScroll = () => {
    const lenis = new Lenis()
    function raf(time:any){
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
}