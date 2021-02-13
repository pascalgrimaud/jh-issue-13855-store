import { Size } from 'app/entities/enumerations/size.model';

export interface IProduct {
  id?: number;
  name?: string;
  description?: string | null;
  price?: number;
  size?: Size;
  imageContentType?: string | null;
  image?: string | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public price?: number,
    public size?: Size,
    public imageContentType?: string | null,
    public image?: string | null
  ) {}
}
