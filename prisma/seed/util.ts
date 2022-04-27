
export const randomDate = (start = new Date(1600, 0, 1), end = new Date()) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const getFish = () => `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sapien elit, bibendum id lacinia in, pellentesque ut neque. Aliquam erat volutpat. Cras vulputate, enim quis fringilla consectetur, erat leo suscipit lectus, ut posuere sem arcu quis odio. Donec suscipit dui sit amet iaculis fermentum. Pellentesque pulvinar urna sit amet metus vehicula, non cursus quam porttitor. Aenean eget tristique leo, ac suscipit lorem. Praesent turpis nulla, laoreet sit amet facilisis et, rutrum sed felis. Curabitur egestas malesuada ex. Etiam sit amet nunc iaculis, venenatis libero ut, tristique eros. Nulla porta ligula leo, a lobortis leo convallis in. Ut ullamcorper arcu sed risus mattis, sed molestie lorem tempor. Donec at blandit erat. Ut auctor tempor eros, a feugiat risus feugiat non. Aenean et nunc nec leo mollis pharetra. Integer facilisis vel lectus non posuere.`;

export const random = (min: number , max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const pick = <T>(array: Array<T>) => array.at(random(0, array.length - 1));

export const pickMany = <T>(array: Array<T>, coef: number = 0.4301) => array.filter(_ => Math.random() >= coef);

export const randomString = (length: number) => Array(length).fill(0).map(()=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.random()*62)).join("");
