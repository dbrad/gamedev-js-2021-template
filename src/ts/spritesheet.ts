export type TextureJson = {
    _type: "s" | "r";
    _name: string | string[];
    _x: number;
    _y: number;
    _w: number;
    _h: number;
};

export type TextureAssetJson = {
    _dataUrl: string,
    _textures: TextureJson[];
};

export let spritesheet: TextureAssetJson = {
    _dataUrl: "data:image/webp;base64,UklGRsIDAABXRUJQVlA4TLYDAAAvz8AHEO+gKJLkJApYQir+TeXPzCSCbSRbbfCmCFJyGqJcWnAFeKSXKpOaSLaaq+miBvCGZyz81BLIpG1ivNeELwHB+v8BIQXZGNnICGFTEL4fzQYFkQayEQpiXFguFMQnYgddQmyA/mDfxN2A0yLbYYBl21bbhjQrUqIUl/TMf57weO8J2//nRvQfgiRJUpvqHmtYQJo9OPyFG6vSfRPpOlI/UGBjPaUpquOGfD+29i/zA+frz5m4CaBvvzjw+re9TojrSP2Ac1ymVEpPMC5l2Dx7M8CGccNbt07PU+s6IvFLXa19PSlsNVk2zWNc3zacYrEd8yLTzzNyQxLb763cMAT8/vsQxOCNRJ1JWiHJOkMKBHXinbURvwAX/9Rx9wPYtj69LqfvC5v7kZr3ZB1Oe6q+eD2HlDNBGtK447ydqB+5+qJlE45fZlxwrq9cwcWVqeP61M9rCNn53/wDwRVk53lU1y+E9PPLryAg6HS2Lh8M+Ym7KoIFn76O3aL9enq8yBP/wKXSh9/fDes5vJ5zbFnPV8QNZHoejNvGOrLXZc81bIy5r8Doem7IzgJbuDyXNCWkQFgPQ5arE1esO0m42knC1STp7M+435hVywVnN4DkZXeSm0zaVSQvu5XkLGtXef4KU5ylOQY6Y5gkiNrex7xr3nVDUbMC1GRYmBaFmetJQpKkxt5VGcHf/xfwExx243sndSHjqWJc222UTsaZWGaj8DKR3Mxn6rVIarw5KoP4MA7CsRuyafteyVBtw3fiexc6g2V2ZHnSozr//5VpQUgIU0Bj7TQqviX9Pkp64J4kXbh0GzlSAau8gZsfcLZsVL8ZrfqblkiFSlfCKD6NWzTfBaCdJCdkxm/uG5tbBE7lDQEmmQPZkPZA8/9ybFpeYWl/KVAx9/FB/PPZ/CRrUkz9pilC83DWudo5vRDN+q+j5rW8Hvc3++Nrp+W1AJUb5ucySi9gpsY0lYYCpkqf3RkwgDSC52VVDxKtFEfAJ4EbGFZJYMDyOg4vKRkmtbQL7VpgYhjVgHOAKcbJMMl3pz2UV47wvkrvklbJuXVV3ofZS0pn/xATwSHd54bTSvQB5iQXIRA4CdYF3kN54145jDU1DE4idXRfuFOP1D4njUEtWYN7o/izeA1GxZp9xKtV5XSed0ZXACZkbz3QewEp+xwvxNYS3ep/oZHV3mw19jbUq3Fmey/BkwGaHbLvWQVINWRehPN0uyomDp7OBVFAFGAi9x58Kdq7XwunQFf7f8oFjeh4AQ==",
    _textures: [
        {
            _type: "s",
            _name: "#",
            _x: 0,
            _y: 0,
            _w: 1,
            _h: 1
        },
        {
            _type: "r",
            _name: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
            _x: 0,
            _y: 0,
            _w: 8,
            _h: 8
        },
        {
            _type: "r",
            _name: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "?", ".", ",", "=", "-", "+"],
            _x: 0,
            _y: 8,
            _w: 8,
            _h: 8
        }
    ]
};